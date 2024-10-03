import React, { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions from the backend
    const fetchTransactions = async () => {
      try {
        const response = await transactionService.getAllTransactions();
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearch = (e) => {
    setFilter(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={filter}
        onChange={handleSearch}
        className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
      />

      {/* Loading Spinner */}
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Currency</th>
              <th className="py-2 px-4">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id} className="text-center">
                <td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{transaction.description}</td>
                <td className="py-2 px-4">{transaction.amount.toFixed(2)}</td>
                <td className="py-2 px-4">{transaction.currency}</td>
                <td className="py-2 px-4">{transaction.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
