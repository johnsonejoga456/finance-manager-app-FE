export const types = [
  'Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'Personal Loan', 'Other',
];

export const validateDebt = (data) => {
  if (!data.description) return 'Description is required';
  if (!data.creditor) return 'Creditor is required';
  const balance = parseFloat(data.balance);
  if (isNaN(balance) || balance <= 0) return 'Balance must be greater than 0';
  const interestRate = parseFloat(data.interestRate);
  if (isNaN(interestRate) || interestRate < 0) return 'Interest rate must be non-negative';
  const minimumPayment = parseFloat(data.minimumPayment);
  if (isNaN(minimumPayment) || minimumPayment <= 0) return 'Minimum payment must be greater than 0';
  if (!data.dueDate) return 'Due date is required';
  return null;
};