const Budget = require("../models/Budget");

// @desc Create new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, icon, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBudget = await Budget.create({ category, icon, amount, month });
    res.status(201).json(newBudget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all budgets (optionally filter by month)
exports.getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter).sort({ createdAt: -1 });
    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await Budget.findByIdAndDelete(id);
    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Server error" });
  }
};
