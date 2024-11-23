import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        targetAmount: { type: Number, required: true },
        currentAmount: { type: Number, default: 0 }, // Default to 0 since progress starts at 0
        deadline: { type: Date, required: true },
        milestones: [
            {
                amount: { type: Number, required: true }, // Milestone target amount
                achieved: { type: Boolean, default: false }, // Whether the milestone is achieved
            },
        ],
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    },
    { timestamps: true }
);

// Virtual field for progress calculation
goalSchema.virtual("progress").get(function () {
    if (this.targetAmount === 0) return 0; // Avoid division by zero
    return Math.min(((this.currentAmount / this.targetAmount) * 100).toFixed(2), 100); // Ensure progress does not exceed 100%
});

// Include virtuals in JSON and Object responses
goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });

// Pre-save validation: Ensure `currentAmount` does not exceed `targetAmount`
goalSchema.pre("save", function (next) {
    if (this.currentAmount > this.targetAmount) {
        return next(new Error("Current amount cannot exceed the target amount."));
    }
    next();
});

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
