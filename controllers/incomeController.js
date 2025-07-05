const Income = require("../models/Income.js");
const xlsx = require("xlsx");
exports.addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      icon,
      source,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    await newIncome.save();
    res
      .status(200)
      .json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    console.error("Error adding income:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllIncomes = async (req, res) => {
  try {
    const income = await Income.find().sort({ date: -1 });
    res.json(income);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.downloadIncomeExcel = async (req, res) => {
  try {
    const income = await Income.find().sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    console.error("Error downloading income Excel:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
