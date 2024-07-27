const requestOptions = {
  method: 'GET'
}

export const newExpId = () => {
  return '' + (Date.now() % 10000000)
}

const listLatestExpenses = (pageNumber, pageSize) => {
  console.info("Fetching recent expenses")
  return fetch(`${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/list/recent?page=${pageNumber}&size=${pageSize}`, requestOptions)
    .then(response => response.json())
}

export const listExpenseByDate = (byDate, pageNumber, pageSize) => {
  console.info("Fetching expenses by date %s", byDate)
  return fetch(`${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/list/bydate?byDate=${byDate}&page=${pageNumber}&size=${pageSize}`, requestOptions)
    .then(response => response.json())
}

export const listExpenseByExpenserAndDate = (expenserId, byDate, pageNumber, pageSize) => {
  console.info("Fetching %s expenses by date %s", expenserId, byDate)
  let url = `${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/list/bydate?byDate=${byDate}&page=${pageNumber}&size=${pageSize}`
  if (expenserId !== null && expenserId !== undefined && expenserId !== "") {
    url = `${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/list/bydate?expenserId=${expenserId}&byDate=${byDate}&page=${pageNumber}&size=${pageSize}`
  }
  return fetch(url, requestOptions)
    .then(response => response.json())
}

export default listLatestExpenses;

export function getExpense(expenseId) {
  console.info("Fetching expense [%s] from backend with", expenseId)
  return fetch(`${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/${expenseId}`, requestOptions)
    .then(response => response.json())
}

export function saveExpense(expense) {
  console.info("Saving expense %s...", expense.id)
  var opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  }

  return fetch(`${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/update`, opts)
}

export const deleteExpense = (expense) => {
  console.info("Delete expense %s", expense.id)
  return fetch(`${process.env.REACT_APP_EXPENSE_SERVICE_ENDPOINT}/delete`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    })
    .then(response => response.json())
}