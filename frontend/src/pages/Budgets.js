import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Grid,
  Card,
  Text,
  Progress,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Group,
  Table,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { budgetService } from '../services/budgetService';
import transactionService from '../services/transactionService';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedTransactions, { open: openTransactions, close: closeTransactions }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState(null);

  // Form for creating/editing budgets
  const form = useForm({
    initialValues: {
      category: '',
      amount: 0,
      period: { startDate: new Date(), endDate: new Date() },
      recurrence: 'none',
    },
    validate: {
      category: (value) => (value ? null : 'Category is required'),
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
      period: {
        startDate: (value) => (value ? null : 'Start date is required'),
        endDate: (value, values) =>
          value && new Date(value) >= new Date(values.period.startDate)
            ? null
            : 'End date must be after start date',
      },
    },
  });

  // Fetch budgets and status on mount
  useEffect(() => {
    fetchBudgets();
    fetchBudgetStatus();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getBudgets();
      setBudgets(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch budgets',
        color: 'red',
      });
    }
  };

  const fetchBudgetStatus = async () => {
    try {
      const response = await budgetService.getBudgetStatus();
      setBudgetStatus(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch budget status',
        color: 'red',
      });
    }
  };

  const fetchTransactionsForBudget = async (budget) => {
    try {
      const response = await transactionService.getTransactions({
        category: budget.category,
        dateRange: `${budget.period.startDate.toISOString().split('T')[0]},${budget.period.endDate.toISOString().split('T')[0]}`,
      });
      setTransactions(response.data);
      openTransactions();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch transactions',
        color: 'red',
      });
    }
  };

  const handleCreateBudget = async (values) => {
    try {
      const response = await budgetService.createBudget(values);
      setBudgets([...budgets, response.data]);
      fetchBudgetStatus();
      closeCreate();
      form.reset();
      notifications.show({
        title: 'Success',
        message: 'Budget created successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create budget',
        color: 'red',
      });
    }
  };

  const handleEditBudget = async (values) => {
    try {
      const response = await budgetService.updateBudget(editingBudget.id, values);
      setBudgets(budgets.map((b) => (b._id === editingBudget.id ? response.data : b)));
      fetchBudgetStatus();
      closeEdit();
      setEditingBudget(null);
      form.reset();
      notifications.show({
        title: 'Success',
        message: 'Budget updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update budget',
        color: 'red',
      });
    }
  };

  const handleDeleteBudget = async () => {
    try {
      await budgetService.deleteBudget(deleteBudgetId);
      setBudgets(budgets.filter((b) => b._id !== deleteBudgetId));
      fetchBudgetStatus();
      closeDelete();
      setDeleteBudgetId(null);
      notifications.show({
        title: 'Success',
        message: 'Budget deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete budget',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id) => {
    setDeleteBudgetId(id);
    openDelete();
  };

  const openEditModal = (budget) => {
    setEditingBudget({ id: budget._id, ...budget });
    form.setValues({
      category: budget.category,
      amount: budget.amount,
      period: {
        startDate: new Date(budget.period.startDate),
        endDate: new Date(budget.period.endDate),
      },
      recurrence: budget.recurrence,
    });
    openEdit();
  };

  return (
    <Container size="lg" style={{ padding: '2rem' }}>
      <Title order={2} style={{ marginBottom: '1rem' }}>
        Budgets
      </Title>
      <Button onClick={openCreate} style={{ marginBottom: '1rem' }}>
        Create Budget
      </Button>

      <Grid>
        {budgetStatus.map((status) => (
          <Grid.Col key={status.id} xs={12} sm={6} md={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text weight={500}>{status.category}</Text>
              <Text size="sm" color="dimmed">
                {new Date(status.period.startDate).toLocaleDateString()} -{' '}
                {new Date(status.period.endDate).toLocaleDateString()}
              </Text>
              <Text style={{ marginTop: '0.5rem' }}>
                Budgeted: ${status.budgeted.toFixed(2)}
              </Text>
              <Text>
                Spent: ${status.spent.toFixed(2)}
              </Text>
              <Text>
                Remaining: ${status.remaining.toFixed(2)}
              </Text>
              <Progress
                value={status.percentage}
                color={status.percentage > 100 ? 'red' : 'blue'}
                style={{ marginTop: '0.5rem' }}
                aria-label={`Spending progress for ${status.category}`}
              />
              <Group style={{ marginTop: '1rem' }} position="apart">
                <Button variant="light" onClick={() => fetchTransactionsForBudget(status)}>
                  View Transactions
                </Button>
                <Group>
                  <ActionIcon
                    color="blue"
                    variant="filled"
                    onClick={() => openEditModal(budgets.find((b) => b._id === status.id))}
                    aria-label="Edit budget"
                  >
                    <Text size="xs">E</Text>
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="filled"
                    onClick={() => openDeleteModal(status.id)}
                    aria-label="Delete budget"
                  >
                    <Text size="xs">D</Text>
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Create Budget Modal */}
      <Modal opened={openedCreate} onClose={closeCreate} title="Create Budget" centered>
        <form onSubmit={form.onSubmit(handleCreateBudget)}>
          <TextInput
            label="Category"
            placeholder="e.g., Groceries"
            {...form.getInputProps('category')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <NumberInput
            label="Amount"
            placeholder="e.g., 200"
            min={0}
            {...form.getInputProps('amount')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <DatePicker
            label="Start Date"
            {...form.getInputProps('period.startDate')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <DatePicker
            label="End Date"
            {...form.getInputProps('period.endDate')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Recurrence"
            data={['none', 'daily', 'weekly', 'monthly']}
            {...form.getInputProps('recurrence')}
            style={{ marginBottom: '1rem' }}
          />
          <Group position="right">
            <Button type="submit">Create</Button>
            <Button variant="outline" onClick={closeCreate}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit Budget" centered>
        <form onSubmit={form.onSubmit(handleEditBudget)}>
          <TextInput
            label="Category"
            placeholder="e.g., Groceries"
            {...form.getInputProps('category')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <NumberInput
            label="Amount"
            placeholder="e.g., 200"
            min={0}
            {...form.getInputProps('amount')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <DatePicker
            label="Start Date"
            {...form.getInputProps('period.startDate')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <DatePicker
            label="End Date"
            {...form.getInputProps('period.endDate')}
            required
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Recurrence"
            data={['none', 'daily', 'weekly', 'monthly']}
            {...form.getInputProps('recurrence')}
            style={{ marginBottom: '1rem' }}
          />
          <Group position="right">
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={closeEdit}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Confirm Delete" centered>
        <Text>Are you sure you want to delete this budget?</Text>
        <Group position="right" style={{ marginTop: '1rem' }}>
          <Button color="red" onClick={handleDeleteBudget}>
            Confirm
          </Button>
          <Button variant="outline" onClick={closeDelete}>
            Cancel
          </Button>
        </Group>
      </Modal>

      {/* Transactions Modal */}
      <Modal opened={openedTransactions} onClose={closeTransactions} title="Budget Transactions" centered size="lg">
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.category}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td>{t.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Group position="right" style={{ marginTop: '1rem' }}>
          <Button variant="outline" onClick={closeTransactions}>
            Close
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}