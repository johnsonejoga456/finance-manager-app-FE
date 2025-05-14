'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Title, Table, TextInput, Button, Group, Loader, Badge, ActionIcon, 
  Modal, Text, Select, MultiSelect, Checkbox, Box, Tabs, RingProgress, Paper, Notification 
} from '@mantine/core';
import transactionService from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [insightsTab, setInsightsTab] = useState('list');
  const [insightsData, setInsightsData] = useState(null);

  // Fetch transactions with filters
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = [];
      if (search) queryParams.push(`query=${encodeURIComponent(search)}`);
      if (filterType !== 'all') queryParams.push(`type=${filterType}`);
      if (sortBy) queryParams.push(`sort=${sortBy}`);
      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const data = await transactionService.getAllTransactions(queryString);
      setTransactions(data || []);
    } catch (err) {
      const message = err.response?.status === 401 
        ? 'Unauthorized: Please log in to view transactions.' 
        : err.response?.data?.message || 'Failed to load transactions. Please try again.';
      setError(message);
      console.error('Fetch transactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterType, sortBy]);

  // Fetch insights data
  const fetchInsights = useCallback(async () => {
    try {
      const [total, report, breakdown] = await Promise.all([
        transactionService.getTotalIncomeAndExpenses(),
        transactionService.getIncomeVsExpensesReport(),
        transactionService.getCategoricalBreakdown(),
      ]);
      setInsightsData({ total, report, breakdown });
    } catch (err) {
      const message = err.response?.status === 401 
        ? 'Unauthorized: Please log in to view insights.' 
        : err.response?.data?.message || 'Failed to load insights.';
      setError(message);
      console.error('Error fetching insights:', err);
    }
  }, []);

  // Fetch transactions and insights on mount
  useEffect(() => {
    fetchTransactions();
    fetchInsights();
  }, [fetchTransactions, fetchInsights]);

  // Handlers
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleBulkDelete = async () => {
    try {
      await transactionService.bulkUpdateTransactions({ transactionIds: selectedIds, action: 'delete' });
      setTransactions(transactions.filter(t => !selectedIds.includes(t._id)));
      setSelectedIds([]);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete transactions.';
      setError(message);
      console.error('Bulk delete error:', err);
    }
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setEditModal(true);
  };

  const saveEdit = async () => {
    try {
      const updated = await transactionService.updateTransaction(editData._id, editData);
      setTransactions(transactions.map(t => t._id === updated._id ? updated : t));
      setEditModal(false);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update transaction.';
      setError(message);
      console.error('Update transaction error:', err);
    }
  };

  const handleExport = async (format) => {
    try {
      const blob = format === 'csv' 
        ? await transactionService.exportTransactionsCSV() 
        : await transactionService.exportTransactionsPDF();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err.response?.data?.message || `Failed to export transactions as ${format.toUpperCase()}.`;
      setError(message);
      console.error('Export error:', err);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb="lg">
        <Title order={2} c="gray.9">Transactions</Title>
        <Group>
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'violet' }} onClick={() => setEditModal(true)}>
            Add Transaction
          </Button>
        </Group>
      </Group>

      {/* Error Notification */}
      {error && (
        <Notification color="red" title="Error" onClose={() => setError(null)} mb="md">
          {error}
        </Notification>
      )}

      {/* Filters & Search */}
      <Group mb="md">
        <TextInput
          placeholder="Search by notes, category, or tags..."
          value={search}
          onChange={handleSearch}
          radius="md"
          style={{ flex: 1 }}
        />
        <Select
          data={['all', 'income', 'expense', 'transfer', 'investment']}
          value={filterType}
          onChange={setFilterType}
          placeholder="Filter by type"
          radius="md"
        />
        <Select
          data={['date', 'amount', 'category']}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort by"
          radius="md"
        />
      </Group>

      {/* Tabs: List & Insights */}
      <Tabs value={insightsTab} onTabChange={setInsightsTab} variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="list">Transaction List</Tabs.Tab>
          <Tabs.Tab value="insights">Insights</Tabs.Tab>
        </Tabs.List>

        {/* Transaction List */}
        <Tabs.Panel value="list" pt="md">
          {loading ? (
            <Group position="center" py="xl"><Loader color="violet" /><Text>Loading...</Text></Group>
          ) : transactions.length === 0 ? (
            <Text c="gray.6" ta="center" py="xl">No transactions yet. Add one to get started!</Text>
          ) : (
            <>
              <Group mb="md">
                <Button color="red" disabled={!selectedIds.length} onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  Export PDF
                </Button>
              </Group>
              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th><Checkbox checked={selectedIds.length === transactions.length} onChange={(e) => setSelectedIds(e.target.checked ? transactions.map(t => t._id) : [])} /></th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Category</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td><Checkbox checked={selectedIds.includes(t._id)} onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, t._id] : selectedIds.filter(id => id !== t._id))} /></td>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td><Badge color={t.type === 'income' ? 'teal' : 'orange'}>{t.type}</Badge></td>
                      <td>{t.amount.toFixed(2)}</td>
                      <td>{t.currency}</td>
                      <td>{t.category}</td>
                      <td>{t.notes || '-'}</td>
                      <td>
                        <Group spacing="xs">
                          <ActionIcon color="blue" onClick={() => handleEdit(t)}>E</ActionIcon>
                          <ActionIcon color="red" onClick={() => transactionService.deleteTransaction(t._id).then(() => setTransactions(transactions.filter(tx => tx._id !== t._id)))}>D</ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Tabs.Panel>

        {/* Insights */}
        <Tabs.Panel value="insights" pt="md">
          {insightsData ? (
            <Group spacing="xl">
              <Paper p="md" radius="md" withBorder>
                <Text fw={700}>Total Income: ${insightsData.total.totalIncome.toFixed(2)}</Text>
                <Text fw={700}>Total Expenses: ${insightsData.total.totalExpenses.toFixed(2)}</Text>
              </Paper>
              <RingProgress
                size={150}
                thickness={16}
                sections={[
                  { value: (insightsData.total.totalExpenses / (insightsData.total.totalIncome + insightsData.total.totalExpenses)) * 100, color: 'orange' },
                  { value: (insightsData.total.totalIncome / (insightsData.total.totalIncome + insightsData.total.totalExpenses)) * 100, color: 'teal' },
                ]}
                label={<Text ta="center">Income vs Expenses</Text>}
              />
              <Paper p="md" radius="md" withBorder>
                <Text fw={700}>Expense Breakdown</Text>
                {Object.entries(insightsData.breakdown).map(([cat, amt]) => (
                  <Text key={cat}>{cat}: ${amt.toFixed(2)}</Text>
                ))}
              </Paper>
            </Group>
          ) : (
            <Text>Loading insights...</Text>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Edit/Add Modal */}
      <Modal opened={editModal} onClose={() => setEditModal(false)} title={editData ? 'Edit Transaction' : 'Add Transaction'} radius="md">
        {editData && (
          <Box>
            <Select label="Type" value={editData.type} onChange={(val) => setEditData({ ...editData, type: val })} data={['income', 'expense', 'transfer', 'investment']} />
            <TextInput label="Amount" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} type="number" />
            <TextInput label="Category" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
            <TextInput label="Notes" value={editData.notes || ''} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} />
            <MultiSelect label="Tags" value={editData.tags || []} onChange={(val) => setEditData({ ...editData, tags: val })} data={editData.tags || []} searchable creatable />
            <Button mt="md" variant="gradient" gradient={{ from: 'indigo', to: 'violet' }} onClick={saveEdit}>Save</Button>
          </Box>
        )}
      </Modal>
    </Container>
  );
};

export default Transactions;