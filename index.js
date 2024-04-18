const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 3455;
const cors = require('cors');

const pool = new Pool({
  connectionString: "postgres://finance_ii2e_user:GnhS5vSqezQXi03oJQQGBzkv2PoZfATs@dpg-cognl4gl5elc73c1nd6g-a.oregon-postgres.render.com/finance_ii2e?sslmode=require"
});

app.use(express.json());
app.use(cors());

// GET ALL TRANSACTION EXPENSES
app.get('/api/transaction/expenses/all', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM expenses;';
    const expenses = await pool.query(queryText);
    res.status(201).send(expenses.rows);
  } catch (error) {
    console.error('Error creating expenses:', error);
    res.status(500).send('Internal server error occurred while getting a expenses data.');
  }
});
// GET ALL TRANSACTION INCOMES
app.get('/api/transaction/incomes/all', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM incomes;';
    const expenses = await pool.query(queryText);
    res.status(201).send(expenses.rows);
  } catch (error) {
    console.error('Error creating expenses:', error);
    res.status(500).send('Internal server error occurred while getting a expenses data.');
  }
});

// GET TOP TRANSACTION CATEGORIES
app.get('/api/transaction/expenses/category/top', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM expenses WHERE time=$1 ORDER BY amount DESC LIMIT 3;';
    const expenses = await pool.query(queryText,['monthly']);
    res.status(201).send(expenses.rows);
  } catch (error) {
    console.error('Error creating expenses:', error);
    res.status(500).send('Internal server error occurred while getting a expenses data.');
  }
});

// CREATE A NEW expense

app.post('/api/transaction/expense/create', async (req, res) => {
  const data = req.body;
  try {
    const queryText = 'INSERT INTO expenses (category, amount, date, time) VALUES ($1, $2, $3, $4)';
    await pool.query(queryText, [data.category, data.amount, data.date, data.time]);
    res.status(201).send('Expense Inserted Successfully.');
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).send('Internal server error occurred while creating a expense data.');
  }
});

// CREATE A NEW income

app.post('/api/transaction/income/create', async (req, res) => {
  const data = req.body;
  try {
    const queryText = 'INSERT INTO incomes (time, amount) VALUES ($1, $2)';
    await pool.query(queryText, [data.time, data.amount]);
    res.status(201).send('Income Created Successfully.');
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(500).send('Internal server error occurred while creating a income data.');
  }
});

// CREATE A NEW Budget

app.post('/api/budget/create', async (req, res) => {
  const data = req.body;
  try {
    const queryText = 'INSERT INTO budget (id,weekly,monthly) VALUES ($1, $2, $3)';
    await pool.query(queryText, [data.id,data.weekly, data.monthly]);
    res.status(201).send('Created Budget Successfully.');
  } catch (error) {
    console.error('Error adding budget:', error);
    res.status(500).send('Internal server error occurred while adding budget data.');
  }
});

// GET ALL REPORT
app.get('/api/report', async (req, res) => {
    try {
      const expenseMonthly = (await pool.query('SELECT SUM(amount) AS total_monthly_expenses FROM expenses WHERE time = $1', ['monthly'])).rows[0].total_monthly_expenses;
      const incomeMonthly =  (await pool.query('SELECT SUM(amount) AS total_monthly_incomes FROM incomes WHERE time = $1', ['monthly'])).rows[0].total_monthly_incomes;
      const expenseWeekly =  (await pool.query('SELECT SUM(amount) AS total_weekly_expenses FROM expenses WHERE time = $1', ['weekly'])).rows[0].total_weekly_expenses;
      const incomeWeekly =  (await pool.query('SELECT SUM(amount) AS total_weekly_incomes FROM incomes WHERE time = $1', ['weekly'])).rows[0].total_weekly_incomes;
      const budgetWeekly =  (await pool.query('SELECT SUM(weekly) AS total_weekly_budget FROM budget ;')).rows[0].total_weekly_budget;
      const budgetMonthly =  (await pool.query('SELECT SUM(monthly) AS total_monthly_budget FROM budget;')).rows[0].total_monthly_budget;
      const data = {
        total_monthly_expenses: expenseMonthly,
        total_monthly_incomes: incomeMonthly,
        total_weekly_expenses: expenseWeekly,
        total_weekly_incomes: incomeWeekly,
        total_weekly_budget: budgetWeekly,
        total_monthly_budget: budgetMonthly,
      }
      res.status(200).send(data);
    } catch (error) {
      console.error('Error getting report:', error);
      res.status(500).send('Internal server error occurred while getting report data.');
    }
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
