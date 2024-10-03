import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['income', 'expense', 'transfer', 'investment'], // Add types categories
        required: true 
    },
    subType: { // Add field for sub-categories
        type: String,
        enum: ['salary', 'bonus', 'groceries', 'rent', 'utilities', 'stocks', 'bonds', 'savings'], // Example sub-categories
        required: false 
    },
    amount: { type: Number, required: true },
    originalAmount: { type: Number, required: true }, // Original amount in user's currency
    currency: { type: String, required: true }, // Original currency
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String },   // Notes field
    tags: [{ type: String }],  // Tags as an array of strings
    recurrence: { type: String, enum: ['daily', 'weekly', 'monthly'] } // Recurrence field
});

export default mongoose.model('Transaction', TransactionSchema);
