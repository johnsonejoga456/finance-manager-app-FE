export const categories = [
  'Bar', 'Entertainment', 'Fuel', 'Shoes/Clothing', 'Credit Card',
  'Eating Out', 'Technology', 'Gifts', 'Other',
];

export const validateForm = (data) => {
  if (!data.category) return 'Category is required';
  if (!data.amount || data.amount <= 0) return 'Amount must be greater than 0';
  if (data.period === 'custom') {
    if (!data.customPeriod.startDate || !data.customPeriod.endDate) return 'Start and end dates are required';
    if (new Date(data.customPeriod.startDate) >= new Date(data.customPeriod.endDate)) return 'End date must be after start date';
  }
  if (data.alertThreshold < 0 || data.alertThreshold > 100) return 'Threshold must be between 0 and 100';
  return null;
};