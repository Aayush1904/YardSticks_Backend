const Income = require("../models/Income.js");
const Expense = require("../models/Expense.js");

exports.getDashboardData = async (req, res) => {
  try {
    // Total income from all entries
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Total expenses from all entries
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Last 60 days income
    const last60DaysIncomeTransactions = await Income.find({
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Last 30 days expenses
    const last30DaysExpenseTransactions = await Expense.find({
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Last 5 recent transactions (combined)
    const lastTransactions = [
      ...(await Income.find().sort({ date: -1 }).limit(5)).map((t) => ({
        type: "income",
        ...t.toObject(),
      })),
      ...(await Expense.find().sort({ date: -1 }).limit(5)).map((t) => ({
        type: "expense",
        ...t.toObject(),
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5); // Sorted by date

    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      last30DaysExpense: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
