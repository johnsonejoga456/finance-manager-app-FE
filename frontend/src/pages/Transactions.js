"use client"

import { useState, useEffect, useCallback } from "react"
import transactionService from "../services/transactionService"
import accountService from "../services/accountService"
import TransactionFilters from "../components/Transactions/TransactionFilters"
import TransactionList from "../components/Transactions/TransactionList"
import TransactionModals from "../components/Transactions/TransactionModals"
import TransactionSummary from "../components/Transactions/TransactionSummary"
import SpendingAlerts from "../components/Transactions/SpendingAlerts"
import BalanceChart from "../components/Accounts/BalanceChart"

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState(null)
  const [spendingAlerts, setSpendingAlerts] = useState([])
  const [summary, setSummary] = useState({ total: 0 })
  const [categorySummary, setCategorySummary] = useState({})
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [filterNotes, setFilterNotes] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterTags, setFilterTags] = useState("")
  const [openedAdd, setOpenedAdd] = useState(false)
  const [openedDelete, setOpenedDelete] = useState(false)
  const [openedEdit, setOpenedEdit] = useState(false)
  const [deleteTransactionId, setDeleteTransactionId] = useState(null)
  const [editTransaction, setEditTransaction] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const transactionsPerPage = 5

  const categories = [
    "Bar",
    "Entertainment",
    "Fuel",
    "Shoes/Clothing",
    "Credit Card",
    "Eating Out",
    "Technology",
    "Gifts",
    "Other",
  ]

  const subTypes = {
    income: ["salary", "bonus", "freelance", "gift", "refund"],
    expense: ["groceries", "rent", "utilities", "subscription"],
    transfer: ["savings"],
    investment: ["stocks", "bonds"],
  }

  // Updated category icons using emoji instead of FontAwesome
  const categoryIcons = {
    Bar: "🍺",
    Entertainment: "🎬",
    Fuel: "⛽",
    "Shoes/Clothing": "👕",
    "Credit Card": "💳",
    "Eating Out": "🍽️",
    Technology: "💻",
    Gifts: "🎁",
    Other: "📋",
  }

  const [form, setForm] = useState({
    type: "expense",
    subType: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    tags: "",
    recurrence: "",
    currency: "USD",
    account: "",
  })

  const [editForm, setEditForm] = useState({
    type: "",
    subType: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
    tags: "",
    recurrence: "",
    currency: "USD",
    account: "",
  })

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = {
        page: currentPage,
        limit: transactionsPerPage,
      }

      if (filterCategory) params.category = filterCategory
      if (filterStartDate) params.startDate = filterStartDate
      if (filterEndDate) params.endDate = filterEndDate
      if (filterNotes) params.query = filterNotes
      if (filterType) params.type = filterType
      if (filterTags) params.tags = filterTags

      const response = await transactionService.getTransactions(params)
      const { data, total } = response.data

      setTransactions(data || [])
      setTotalTransactions(total || 0)
      calculateSummary(data || [])
      calculateCategorySummary(data || [])
      checkSpendingAlerts(data || [])
      setError(null)
    } catch (error) {
      if (error.message.includes("Session expired")) {
        setError("Session expired. Please log in again.")
      } else {
        setError("Failed to fetch transactions. Please try again.")
      }
      console.error("Fetch transactions error:", error.message)
      setTransactions([])
      setTotalTransactions(0)
    } finally {
      setIsLoading(false)
    }
  }, [filterCategory, filterStartDate, filterEndDate, filterNotes, filterType, filterTags, currentPage])

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await accountService.getAccounts()
      const fetchedAccounts = response.data.data || []
      setAccounts(fetchedAccounts)
      console.log("Fetched accounts:", fetchedAccounts)
      setError(null)
    } catch (error) {
      console.error("Fetch accounts error:", error.message)
      setError("Failed to fetch accounts")
      setAccounts([])
    }
  }, [])

  const calculateSummary = (data) => {
    const total = Array.isArray(data)
      ? data.reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0)
      : 0
    setSummary({ total })
  }

  const calculateCategorySummary = (data) => {
    const summary = Array.isArray(data)
      ? data.reduce((acc, t) => {
          if (t.type === "expense") {
            acc[t.category] = (acc[t.category] || 0) + t.amount
          }
          return acc
        }, {})
      : {}
    setCategorySummary(summary)
  }

  const checkSpendingAlerts = (data) => {
    const threshold = 200
    const summary = Array.isArray(data)
      ? data.reduce((acc, t) => {
          if (t.type === "expense") {
            acc[t.category] = (acc[t.category] || 0) + t.amount
          }
          return acc
        }, {})
      : {}

    const alerts = Object.entries(summary).reduce((acc, [category, amount]) => {
      if (amount > threshold) {
        acc.push(`You've spent $${amount.toFixed(2)} on ${category}, exceeding $${threshold}.`)
      }
      return acc
    }, [])

    setSpendingAlerts(alerts)
  }

  useEffect(() => {
    fetchTransactions()
    fetchAccounts()
  }, [fetchTransactions, fetchAccounts])

  const handleAddTransaction = async (values) => {
    try {
      await transactionService.addTransaction({
        ...values,
        amount: Number.parseFloat(values.amount),
        tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      })
      setForm({
        type: "expense",
        subType: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        tags: "",
        recurrence: "",
        currency: "USD",
        account: "",
      })
      setOpenedAdd(false)
      setError(null)
      await fetchTransactions()
    } catch (error) {
      if (error.message.includes("Session expired")) {
        setError("Session expired. Please log in again.")
      } else {
        setError("Failed to add transaction. Please try again.")
      }
      console.error("Add transaction error:", error.message)
    }
  }

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      await transactionService.updateTransaction(updatedTransaction._id, {
        type: updatedTransaction.type,
        subType: updatedTransaction.subType,
        amount: Number.parseFloat(updatedTransaction.amount),
        category: updatedTransaction.category,
        date: updatedTransaction.date,
        notes: updatedTransaction.notes,
        tags: updatedTransaction.tags ? updatedTransaction.tags.split(",").map((tag) => tag.trim()) : [],
        recurrence: updatedTransaction.recurrence,
        currency: updatedTransaction.currency,
        account: updatedTransaction.account,
      })
      setOpenedEdit(false)
      setEditTransaction(null)
      setError(null)
      await fetchTransactions()
    } catch (error) {
      if (error.message.includes("Session expired")) {
        setError("Session expired. Please log in again.")
      } else {
        setError("Failed to update transaction. Please try again.")
      }
      console.error("Edit transaction error:", error.message)
    }
  }

  const handleDeleteTransaction = async () => {
    try {
      await transactionService.deleteTransaction(deleteTransactionId)
      setOpenedDelete(false)
      setDeleteTransactionId(null)
      setError(null)
      await fetchTransactions()
    } catch (error) {
      if (error.message.includes("Session expired")) {
        setError("Session expired. Please log in again.")
      } else {
        setError("Failed to delete transaction. Please try again.")
      }
      console.error("Delete transaction error:", error.message)
    }
  }

  const handleCSVImport = async (file) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      await transactionService.importCSV(formData)
      setError(null)
      await fetchTransactions()
    } catch (error) {
      if (error.message.includes("Session expired")) {
        setError("Session expired. Please log in again.")
      } else {
        setError("Failed to import CSV. Please check the file format.")
      }
      console.error("CSV import error:", error.message)
    }
  }

  const handleExport = async (format, retries = 3) => {
    try {
      const response = await transactionService[`export${format === "csv" ? "Transactions" : "TransactionsAsPDF"}`]()
      const contentType = format === "csv" ? "text/csv" : "application/pdf"
      const blob = new Blob([response.data], { type: contentType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `transactions.${format}`
      a.click()
      window.URL.revokeObjectURL(url)
      setError(null)
    } catch (error) {
      if (error.message.includes("Session expired")) {
        setError("Session expired. Please log in again.")
      } else if (retries > 0) {
        console.warn(`${format.toUpperCase()} export failed, retrying... (${retries} attempts left)`)
        setTimeout(() => handleExport(format, retries - 1), 1000)
      } else {
        setError(`Failed to export ${format.toUpperCase()}. Please try again later or contact support.`)
        console.error(`${format.toUpperCase()} export error:`, error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-xl p-3 mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
                <p className="text-gray-600 mt-1">Track and manage your financial transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
              <button
                className="text-red-400 hover:text-red-600 transition-colors duration-200"
                onClick={() => setError(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Balance Chart */}
        <div className="mb-8">
          <BalanceChart transactions={transactions} />
        </div>

        {/* Transaction Summary */}
        <TransactionSummary summary={summary} categorySummary={categorySummary} />

        {/* Spending Alerts */}
        <SpendingAlerts alerts={spendingAlerts} setAlerts={setSpendingAlerts} />

        {/* Transaction Filters */}
        <TransactionFilters
          categories={categories}
          subTypes={subTypes}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStartDate={filterStartDate}
          setFilterStartDate={setFilterStartDate}
          filterEndDate={filterEndDate}
          setFilterEndDate={setFilterEndDate}
          filterNotes={filterNotes}
          setFilterNotes={setFilterNotes}
          filterType={filterType}
          setFilterType={setFilterType}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          transactions={transactions}
          handleCSVImport={handleCSVImport}
          handleExport={handleExport}
          openAdd={() => setOpenedAdd(true)}
        />

        {/* Transaction List */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            categoryIcons={categoryIcons}
            accounts={accounts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            transactionsPerPage={transactionsPerPage}
            totalTransactions={totalTransactions}
            setEditTransaction={setEditTransaction}
            setEditForm={setEditForm}
            setDeleteTransactionId={setDeleteTransactionId}
            openEditTransaction={() => setOpenedEdit(true)}
            openDeleteTransaction={() => setOpenedDelete(true)}
          />
        )}

        {/* Transaction Modals */}
        <TransactionModals
          openedAdd={openedAdd}
          closeAdd={() => setOpenedAdd(false)}
          openedEdit={openedEdit}
          closeEdit={() => setOpenedEdit(false)}
          openedDelete={openedDelete}
          closeDelete={() => setOpenedDelete(false)}
          form={form}
          setForm={setForm}
          editForm={editForm}
          setEditForm={setEditForm}
          editTransaction={editTransaction}
          handleAddTransaction={handleAddTransaction}
          handleEditTransaction={handleEditTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
          categories={categories}
          subTypes={subTypes}
          accounts={accounts}
        />
      </div>
    </div>
  )
}
