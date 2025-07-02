import { useState, useEffect, useCallback } from "react"
import { budgetService } from "../services/budgetService"
import transactionService from "../services/transactionService"
import axios from "axios"
import BudgetOverview from "../components/Budgets/BudgetOverview"
import BudgetChart from "../components/Budgets/BudgetChart"
import CreateBudgetModal from "../components/Budgets/CreateBudgetModal"
import EditBudgetModal from "../components/Budgets/EditBudgetModal"
import DeleteBudgetModal from "../components/Budgets/DeleteBudgetModal"
import TransactionsModal from "../components/Budgets/TransactionsModal"
import ErrorAlert from "../components/Budgets/ErrorAlert"
import { validateForm, categories } from "../utils/budgetUtils"

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [budgetStatus, setBudgetStatus] = useState([])
  const [budgetInsights, setBudgetInsights] = useState({ categories: [], spending: [] })
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState(null)
  const [openedCreate, setOpenedCreate] = useState(false)
  const [openedEdit, setOpenedEdit] = useState(false)
  const [openedTransactions, setOpenedTransactions] = useState(false)
  const [openedDelete, setOpenedDelete] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [deleteBudgetId, setDeleteBudgetId] = useState(null)
  const [filterCategory, setFilterCategory] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const transactionsPerPage = 5

  const [form, setForm] = useState({
    category: "",
    amount: "",
    currency: "USD",
    period: "monthly",
    customPeriod: { startDate: "", endDate: "" },
    recurrence: "none",
    alertThreshold: 90,
  })

  const [editForm, setEditForm] = useState({
    category: "",
    amount: "",
    currency: "USD",
    period: "monthly",
    customPeriod: { startDate: "", endDate: "" },
    recurrence: "none",
    alertThreshold: 90,
  })

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await budgetService.getBudgets()
      const fetchedBudgets = Array.isArray(response.data) ? response.data : []
      setBudgets(fetchedBudgets)
      console.log("Fetched budgets:", fetchedBudgets)
      setError(null)
    } catch (err) {
      console.error("Fetch budgets error:", err.message)
      setError(err.message || "Failed to fetch budgets")
      setBudgets([])
    }
  }, [])

  const fetchBudgetStatus = useCallback(async () => {
    try {
      const response = await budgetService.getBudgetStatus()
      let filteredStatus = Array.isArray(response.data) ? response.data : []

      if (filterCategory) filteredStatus = filteredStatus.filter((s) => s.category === filterCategory)
      if (filterPeriod) filteredStatus = filteredStatus.filter((s) => s.period === filterPeriod)

      setBudgetStatus(filteredStatus)
      console.log("Fetched budget status:", filteredStatus)
      setError(null)
    } catch (err) {
      console.error("Fetch budget status error:", err.message)
      setError(err.message || "Failed to fetch budget status")
      setBudgetStatus([])
    }
  }, [filterCategory, filterPeriod])

  const fetchBudgetInsights = useCallback(async () => {
    try {
      const response = await budgetService.getBudgetInsights()
      setBudgetInsights(response.data || { categories: [], spending: [] })
      console.log("Fetched budget insights:", response.data)
      setError(null)
    } catch (err) {
      console.error("Fetch budget insights error:", err.message)
      setError(err.message || "Failed to fetch budget insights")
      setBudgetInsights({ categories: [], spending: [] })
    }
  }, [])

  const fetchTransactionsForBudget = useCallback(async (budget) => {
    try {
      setLoadingTransactions(true)
      const { startDate, endDate } = budget.periodDates
      const dateRange = `${new Date(startDate).toISOString().split("T")[0]},${new Date(endDate).toISOString().split("T")[0]}`

      console.log(`Fetching transactions for budget ${budget._id}: category=${budget.category}, dateRange=${dateRange}`)

      const response = await transactionService.getTransactions({
        category: budget.category,
        dateRange,
      })

      const fetchedTransactions = Array.isArray(response.data.data) ? response.data.data : []
      setTransactions(fetchedTransactions)
      console.log("Fetched transactions:", fetchedTransactions)
      setCurrentPage(1)
      setOpenedTransactions(true)
      setError(null)
    } catch (err) {
      console.error("Fetch transactions error:", err.message)
      setError(err.message || "Failed to fetch transactions")
      setTransactions([])
    } finally {
      setLoadingTransactions(false)
    }
  }, [])

  const handleCreateBudget = useCallback(async () => {
    const validationError = validateForm(form)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const payload = {
        ...form,
        amount: Number.parseFloat(form.amount),
        alertThreshold: Number.parseFloat(form.alertThreshold),
        customPeriod: form.period === "custom" ? form.customPeriod : undefined,
      }

      await budgetService.createBudget(payload)
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()])

      setForm({
        category: "",
        amount: "",
        currency: "USD",
        period: "monthly",
        customPeriod: { startDate: "", endDate: "" },
        recurrence: "none",
        alertThreshold: 90,
      })
      setOpenedCreate(false)
      setError(null)
    } catch (err) {
      console.error("Create budget error:", err.message)
      setError(err.message || "Failed to create budget")
    }
  }, [form, fetchBudgets, fetchBudgetStatus, fetchBudgetInsights])

  const handleEditBudget = useCallback(async () => {
    const validationError = validateForm(editForm)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const payload = {
        ...editForm,
        amount: Number.parseFloat(editForm.amount),
        alertThreshold: Number.parseFloat(editForm.alertThreshold),
        customPeriod: editForm.period === "custom" ? editForm.customPeriod : undefined,
      }

      await budgetService.updateBudget(editingBudget._id, payload)
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()])

      setEditForm({
        category: "",
        amount: "",
        currency: "USD",
        period: "monthly",
        customPeriod: { startDate: "", endDate: "" },
        recurrence: "none",
        alertThreshold: 90,
      })
      setOpenedEdit(false)
      setEditingBudget(null)
      setError(null)
    } catch (err) {
      console.error("Update budget error:", err.message)
      setError(err.message || "Failed to update budget")
    }
  }, [editForm, editingBudget, fetchBudgets, fetchBudgetStatus, fetchBudgetInsights])

  const handleDeleteBudget = useCallback(async () => {
    try {
      await budgetService.deleteBudget(deleteBudgetId)
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()])
      setOpenedDelete(false)
      setDeleteBudgetId(null)
      setError(null)
    } catch (err) {
      console.error("Delete budget error:", err.message)
      setError(err.message || "Failed to delete budget")
    }
  }, [deleteBudgetId, fetchBudgets, fetchBudgetStatus, fetchBudgetInsights])

  const handleExport = useCallback(async (format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/budgets/export/${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `budgets.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      setError(null)
    } catch (err) {
      console.error("Export budgets error:", err.message)
      setError("Failed to export budgets")
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()])
      setIsLoading(false)
    }
    loadData()
  }, [fetchBudgets, fetchBudgetStatus, fetchBudgetInsights, filterCategory, filterPeriod])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-emerald-600 rounded-xl p-3 mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
                <p className="text-gray-600 mt-1">Track and manage your spending limits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        <ErrorAlert error={error} onClose={() => setError(null)} />

        {/* Action Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
                onClick={() => setOpenedCreate(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Budget
              </button>

              <div className="flex gap-3">
                <select
                  className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  aria-label="Filter by period"
                >
                  <option value="">All Periods</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
                onClick={() => handleExport("csv")}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
                onClick={() => handleExport("pdf")}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading budget data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <BudgetOverview
              budgetStatus={budgetStatus}
              budgets={budgets}
              onViewTransactions={fetchTransactionsForBudget}
              onEdit={(budget) => {
                setEditingBudget(budget)
                setEditForm({
                  category: budget.category || "",
                  amount: budget.amount?.toString() || "",
                  currency: budget.currency || "USD",
                  period: budget.period || "monthly",
                  customPeriod: {
                    startDate: budget.customPeriod?.startDate
                      ? new Date(budget.customPeriod.startDate).toISOString().split("T")[0]
                      : "",
                    endDate: budget.customPeriod?.endDate
                      ? new Date(budget.customPeriod.endDate).toISOString().split("T")[0]
                      : "",
                  },
                  recurrence: budget.recurrence || "none",
                  alertThreshold: budget.alertThreshold || 90,
                })
                setOpenedEdit(true)
              }}
              onDelete={(id) => {
                setDeleteBudgetId(id)
                setOpenedDelete(true)
              }}
            />

            <BudgetChart budgetInsights={budgetInsights} />
          </div>
        )}

        {/* Modals */}
        <CreateBudgetModal
          isOpen={openedCreate}
          onClose={() => setOpenedCreate(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleCreateBudget}
        />

        <EditBudgetModal
          isOpen={openedEdit}
          onClose={() => setOpenedEdit(false)}
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleEditBudget}
        />

        <DeleteBudgetModal
          isOpen={openedDelete}
          onClose={() => setOpenedDelete(false)}
          onConfirm={handleDeleteBudget}
        />

        <TransactionsModal
          isOpen={openedTransactions}
          onClose={() => {
            setOpenedTransactions(false)
            setTransactions([])
          }}
          transactions={transactions}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          transactionsPerPage={transactionsPerPage}
          loading={loadingTransactions}
        />
      </div>
    </div>
  )
}