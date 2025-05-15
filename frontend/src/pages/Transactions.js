import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Button,
  TextInput,
  Select,
  Group,
  Card,
  Text,
  Modal,
  NumberInput,
  FileInput,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import transactionService from '../services/transactionService';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [summary, setSummary] = useState({ total: 0 });
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterNotes, setFilterNotes] = useState('');
  const [filterType, setFilterType] = useState('');
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);

  const categories = ['Bar', 'Entertainment', 'Fuel', 'Shoes/Clothing', 'Credit Card', 'Eating Out', 'Technology', 'Gifts', 'Other'];
  const subTypes = {
    income: ['salary', 'bonus', 'freelance', 'gift', 'refund'],
    expense: ['groceries', 'rent', 'utilities', 'subscription'],
    transfer: ['savings'],
    investment: ['stocks', 'bonds'],
  };
  const categoryIcons = {
    Bar: '🍺',
    Entertainment: '🎉',
    Fuel: '⛽',
    'Shoes/Clothing': '👟',
    'Credit Card': '💳',
    'Eating Out': '🍽️',
    Technology: '💻',
    Gifts: '🎁',
    Other: '🔧',
  };

  const form = useForm({
    initialValues: {
      type: 'expense',
      subType: '',
      amount: 0,
      category: '',
      date: new Date(),
      notes: '',
      tags: [],
      recurrence: '',
      currency: 'USD',
      splitTransactions: [],
    },
    validate: {
      type: (value) => (value ? null : 'Type is required'),
      category: (value) => (value ? null : 'Category is required'),
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
      date: (value) => (value ? null : 'Date is required'),
    },
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await transactionService.getTransactions();
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      calculateSummary(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch transactions',
        color: 'red',
      });
    }
  }, []);

  const calculateSummary = (data) => {
    const total = data.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    setSummary({ total });
  };

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    if (filterCategory) filtered = filtered.filter((t) => t.category === filterCategory);
    if (filterStartDate && filterEndDate) {
      filtered = filtered.filter((t) => {
        const txDate = new Date(t.date);
        return txDate >= new Date(filterStartDate) && txDate <= new Date(filterEndDate);
      });
    }
    if (filterNotes) filtered = filtered.filter((t) => t.notes?.toLowerCase().includes(filterNotes.toLowerCase()));
    if (filterType) filtered = filtered.filter((t) => t.type === filterType);

    setFilteredTransactions(filtered);
    calculateSummary(filtered);
  }, [filterCategory, filterStartDate, filterEndDate, filterNotes, filterType, transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAddTransaction = async (values) => {
    try {
      const response = await transactionService.addTransaction(values);
      setTransactions([...transactions, response.data]);
      closeAdd();
      form.reset();
      notifications.show({
        title: 'Success',
        message: 'Transaction added successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add transaction',
        color: 'red',
      });
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await transactionService.deleteTransaction(deleteTransactionId);
      setTransactions(transactions.filter((t) => t._id !== deleteTransactionId));
      closeDelete();
      setDeleteTransactionId(null);
      notifications.show({
        title: 'Success',
        message: 'Transaction deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete transaction',
        color: 'red',
      });
    }
  };

  const handleCSVImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await transactionService.importCSV(formData);
      setTransactions([...transactions, ...response.data]);
      notifications.show({
        title: 'Success',
        message: 'Transactions imported successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to import transactions',
        color: 'red',
      });
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await transactionService[`exportTransactions${format === 'csv' ? '' : 'AsPDF'}`]();
      const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      notifications.show({
        title: 'Success',
        message: `Transactions exported as ${format.toUpperCase()} successfully`,
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || `Failed to export transactions as ${format.toUpperCase()}`,
        color: 'red',
      });
    }
  };

  return (
    <Container size="lg" style={{ padding: '2rem' }}>
      <Title order={2} style={{ marginBottom: '1rem', color: '#1e90ff' }}>
        Transactions
      </Title>

      <Group position="apart" style={{ marginBottom: '1rem' }}>
        <Text>Transactions: {filteredTransactions.length}</Text>
        <Text color={summary.total < 0 ? 'red' : 'green'} weight={500}>
          Total: ${summary.total.toFixed(2)}
        </Text>
      </Group>

      <Group style={{ marginBottom: '1rem' }} position="apart">
        <Group>
          <Select
            placeholder="Filter by category"
            data={categories}
            value={filterCategory}
            onChange={setFilterCategory}
            clearable
            style={{ width: 200 }}
          />
          <TextInput
            placeholder="Start Date (YYYY-MM-DD)"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.currentTarget.value)}
            style={{ width: 150 }}
          />
          <TextInput
            placeholder="End Date (YYYY-MM-DD)"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.currentTarget.value)}
            style={{ width: 150 }}
          />
          <TextInput
            placeholder="Search by notes"
            value={filterNotes}
            onChange={(e) => setFilterNotes(e.currentTarget.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filter by type"
            data={['income', 'expense', 'transfer', 'investment']}
            value={filterType}
            onChange={setFilterType}
            clearable
            style={{ width: 150 }}
          />
        </Group>
        <Group>
          <FileInput
            placeholder="Import CSV"
            accept=".csv"
            onChange={handleCSVImport}
            style={{ width: 150 }}
          />
          <Button onClick={openAdd} leftIcon="+" color="green">
            Add Transaction
          </Button>
          <Button onClick={() => handleExport('csv')}>Export CSV</Button>
          <Button onClick={() => handleExport('pdf')}>Export PDF</Button>
        </Group>
      </Group>

      {filteredTransactions.map((t) => (
        <Card
          key={t._id}
          shadow="sm"
          padding="sm"
          radius="md"
          withBorder
          style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
        >
          <Text style={{ width: '40px', textAlign: 'center', fontSize: '1.5rem' }}>
            {categoryIcons[t.category] || '🔧'}
          </Text>
          <div style={{ flex: 1 }}>
            <Text weight={500}>{t.category}</Text>
            <Text size="sm" color="dimmed">{t.notes || '-'}</Text>
          </div>
          <Text style={{ color: t.type === 'income' ? 'green' : 'red', marginRight: '1rem' }}>
            ${t.amount.toFixed(2)} {t.currency}
          </Text>
          <Text style={{ marginRight: '1rem' }}>
            {new Date(t.date).toLocaleDateString()}
          </Text>
          <ActionIcon
            color="red"
            variant="filled"
            onClick={() => {
              setDeleteTransactionId(t._id);
              openDelete();
            }}
          >
            <Text size="xs">-</Text>
          </ActionIcon>
        </Card>
      ))}

      <Modal opened={openedAdd} onClose={closeAdd} title="Add Transaction" centered>
        <form onSubmit={form.onSubmit(handleAddTransaction)}>
          <Select
            label="Type"
            data={['income', 'expense', 'transfer', 'investment']}
            {...form.getInputProps('type')}
            required
            onChange={(value) => form.setFieldValue('subType', '')}
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Sub Type"
            data={subTypes[form.values.type] || []}
            {...form.getInputProps('subType')}
            clearable
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Category"
            data={categories}
            {...form.getInputProps('category')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <NumberInput
            label="Amount"
            placeholder="e.g., 50"
            min={0}
            {...form.getInputProps('amount')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <TextInput
            label="Date (YYYY-MM-DD)"
            {...form.getInputProps('date')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <TextInput
            label="Notes"
            placeholder="e.g., Weekly shopping"
            {...form.getInputProps('notes')}
            style={{ marginBottom: '1rem' }}
          />
          <TextInput
            label="Tags (comma-separated)"
            placeholder="e.g., personal, work"
            {...form.getInputProps('tags')}
            onChange={(e) => form.setFieldValue('tags', e.currentTarget.value.split(',').map(t => t.trim()))}
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Recurrence"
            data={['daily', 'weekly', 'monthly']}
            {...form.getInputProps('recurrence')}
            clearable
            style={{ marginBottom: '1rem' }}
          />
          <TextInput
            label="Currency"
            placeholder="e.g., USD"
            {...form.getInputProps('currency')}
            style={{ marginBottom: '1rem' }}
          />
          <Group position="right">
            <Button type="submit">Add</Button>
            <Button variant="outline" onClick={closeAdd}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal opened={openedDelete} onClose={closeDelete} title="Confirm Delete" centered>
        <Text>Are you sure you want to delete this transaction?</Text>
        <Group position="right" style={{ marginTop: '1rem' }}>
          <Button color="red" onClick={handleDeleteTransaction}>
            Confirm
          </Button>
          <Button variant="outline" onClick={closeDelete}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}