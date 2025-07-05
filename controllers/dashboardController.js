// const Income = require("../models/Income.js");
// const Expense = require("../models/Expense.js");

// exports.getDashboardData = async (req, res) => {
//   try {
//     // Total income from all entries
//     const totalIncome = await Income.aggregate([
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Total expenses from all entries
//     const totalExpenses = await Expense.aggregate([
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Last 60 days income
//     const last60DaysIncomeTransactions = await Income.find({
//       date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
//     }).sort({ date: -1 });

//     const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//       (sum, transaction) => sum + transaction.amount,
//       0
//     );

//     // Last 30 days expenses
//     const last30DaysExpenseTransactions = await Expense.find({
//       date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
//     }).sort({ date: -1 });

//     const expenseLast30Days = last30DaysExpenseTransactions.reduce(
//       (sum, transaction) => sum + transaction.amount,
//       0
//     );

//     // Last 5 recent transactions (combined)
//     const lastTransactions = [
//       ...(await Income.find().sort({ date: -1 }).limit(5)).map((t) => ({
//         type: "income",
//         ...t.toObject(),
//       })),
//       ...(await Expense.find().sort({ date: -1 }).limit(5)).map((t) => ({
//         type: "expense",
//         ...t.toObject(),
//       })),
//     ]
//       .sort((a, b) => new Date(b.date) - new Date(a.date))
//       .slice(0, 5); // Sorted by date

//     res.json({
//       totalBalance:
//         (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
//       totalIncome: totalIncome[0]?.total || 0,
//       totalExpenses: totalExpenses[0]?.total || 0,
//       last30DaysExpense: {
//         total: expenseLast30Days,
//         transactions: last30DaysExpenseTransactions,
//       },
//       last60DaysIncome: {
//         total: incomeLast60Days,
//         transactions: last60DaysIncomeTransactions,
//       },
//       recentTransactions: lastTransactions,
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const Income = require("../models/Income.js");
const Expense = require("../models/Expense.js");
const Budget = require("../models/Budget.js");

exports.getDashboardData = async (req, res) => {
  try {
    // 🔹 Total Income
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 🔹 Total Expenses
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 🔹 Last 60 Days Income
    const last60DaysIncomeTransactions = await Income.find({
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // 🔹 Last 30 Days Expenses
    const last30DaysExpenseTransactions = await Expense.find({
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // 🔹 Last 5 Combined Recent Transactions
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
      .slice(0, 5);

    // 🔸 Budget vs Actual Comparison
    const allBudgets = await Budget.find();
    const allExpenses = await Expense.find();

    // Normalize: Convert "July 2025" -> "july2025"
    // Utility to format date as "Month YYYY"
    const getMonthFromDate = (date) => {
      return new Date(date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    };

    // Normalize month (e.g. trims + converts to consistent case)
    const normalizeMonth = (monthString) => {
      return monthString.trim().toLowerCase();
    };

    // Normalize category (e.g. trims + lowercase)
    const normalizeCategory = (category) => {
      return category.trim().toLowerCase();
    };

    const budgetVsActual = allBudgets.map((budget) => {
      const normalizedBudgetMonth = normalizeMonth(budget.month);
      const normalizedBudgetCategory = normalizeCategory(budget.category);

      const matchingExpenses = allExpenses.filter((expense) => {
        const expenseMonth = normalizeMonth(getMonthFromDate(expense.date));
        const expenseCategory = normalizeCategory(expense.category);

        return (
          expenseCategory === normalizedBudgetCategory &&
          expenseMonth === normalizedBudgetMonth
        );
      });

      const actual = matchingExpenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        category: budget.category, // original category (for label)
        month: budget.month,
        budget: budget.amount,
        actual, // now should not be 0 if data exists
      };
    });

    // 🔸 Spending Insights: Total Expense per Category
    const expenseByCategory = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          amount: 1,
          _id: 0,
        },
      },
    ]);

    // 🔚 Final Response
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
      budgetVsActual,
      spendingInsights: expenseByCategory,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
