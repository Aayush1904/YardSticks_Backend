const express = require("express");
const {
  addIncome,
  getAllIncomes,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController.js");

const router = express.Router();

router.post("/add", addIncome);
router.get("/get", getAllIncomes);
router.get("/downloadexcel", downloadIncomeExcel);
router.delete("/:id", deleteIncome);

module.exports = router;
