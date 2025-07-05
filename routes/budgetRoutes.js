const express = require("express");
const router = express.Router();
const {
  createBudget,
  getBudgets,
  deleteBudget,
} = require("../controllers/budgetController.js");

// POST /api/v1/budget/add
router.post("/add", createBudget);

// GET /api/v1/budget/get
router.get("/get", getBudgets);

// DELETE /api/v1/budget/:id
router.delete("/:id", deleteBudget);

module.exports = router;
