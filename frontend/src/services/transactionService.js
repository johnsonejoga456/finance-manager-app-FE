import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const getAllTransactions = async () => {
  return await axios.get(API_URL);
};

const transactionService = {
  getAllTransactions,
};

export default transactionService;
