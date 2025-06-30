"use client"

import { useState, useEffect } from "react"
import debtService from "../services/debtService"
import axios from "axios"
import DebtOverview from "../components/Debts/DebtOverview"
import DebtChart from "../components/Debts/DebtChart"
import CreateDebtModal from "../components/Debts/CreateDebtModal"
import EditDebtModal from "../components/Debts/EditDebtModal"
import DeleteDebtModal from "../components/Debts/DeleteDebtModal"
import RepaymentStrategy from "../components/Debts/RepaymentStrategy"
import ErrorAlert from "../components/Budgets/ErrorAlert"
import { validateDebt, types } from "../utils/debtUtils"

export default function Debts() {
  const [debts, setDebts] = useState([])
  const [debtStatus, setDebtStatus] = useState([])
  const [repaymentStrategies, setRepaymentStrategies] = useState({ snowball: [], avalanche: [] })
  const [error, setError] = useState(null)
  const [openedCreate, setOpenedCreate] = useState(false)
  const [openedEdit, setOpenedEdit] = useState(false)
  const [openedDelete, setOpenedDelete] = useState(false)
  const [editingDebt, setEditingDebt] = useState(null)
  const [deleteDebtId, setDeleteDebtId] = useState(null)
  const [filterType, setFilterType] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [form, setForm] = useState({
    description: "",
    creditor: "",
    balance: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  })

  const [editForm, setEditForm] = useState({
    description: "",
    creditor: "",
    balance: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  })

  const fetchDebts = async () => {
    try {
      const response = await debtService.getDebts()
      let filteredDebts = response.data || []
      if (filterType) filteredDebts = filteredDebts.filter((d) => d.type === filterType)

      setDebts(filteredDebts)
      setDebtStatus(
        filteredDebts.map((d) => {
          const initialBalance = Number(d.initialBalance) || 0
          const balance = Number(d.balance) || 0
          const progress = initialBalance > 0 ? ((initialBalance - balance) / initialBalance) * 100 : 0

          return {
            id: d._id,
            description: d.description,
            creditor: d.creditor,
            balance,
            interestRate: d.interestRate,
            minimumPayment: d.minimumPayment,
            dueDate: d.dueDate,
            progress: isNaN(progress) ? 0 : progress,
          }
        }),
      )
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch debts")
    }
  }

  const fetchRepaymentStrategies = async () => {
    try {
      const response = await debtService.getRepaymentStrategies()
      setRepaymentStrategies(response.data || { snowball: [], avalanche: [] })
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch repayment strategies")
    }
  }

  const handleCreateDebt = async () => {
    const validationError = validateDebt(form)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const payload = {
        ...form,
        balance: Number.parseFloat(form.balance),
        interestRate: Number.parseFloat(form.interestRate),
        minimumPayment: Number.parseFloat(form.minimumPayment),
        dueDate: form.dueDate,
      }

      await debtService.createDebt(payload)
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()])

      setForm({
        description: "",
        creditor: "",
        balance: "",
        interestRate: "",
        minimumPayment: "",
        dueDate: "",
      })
      setOpenedCreate(false)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to create debt")
    }
  }

  const handleEditDebt = async () => {
    const validationError = validateDebt(editForm)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const payload = {
        ...editForm,
        balance: Number.parseFloat(editForm.balance),
        interestRate: Number.parseFloat(editForm.interestRate),
        minimumPayment: Number.parseFloat(editForm.minimumPayment),
        dueDate: editForm.dueDate,
      }

      await debtService.updateDebt(editingDebt._id, payload)
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()])

      setEditForm({
        description: "",
        creditor: "",
        balance: "",
        interestRate: "",
        minimumPayment: "",
        dueDate: "",
      })
      setOpenedEdit(false)
      setEditingDebt(null)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to update debt")
    }
  }

  const handleDeleteDebt = async () => {
    try {
      await debtService.deleteDebt(deleteDebtId)
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()])
      setOpenedDelete(false)
      setDeleteDebtId(null)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to delete debt")
    }
  }

  const handleRecordPayment = async (debtId, amount, date) => {
    try {
      await debtService.recordPayment(debtId, { amount, date })
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()])
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to record payment")
    }
  }

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/debts/export/${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `debts.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setError(null)
    } catch (err) {
      setError("Failed to export debts")
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()])
      setIsLoading(false)
    }
    loadData()
  }, [filterType])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-600 rounded-xl p-3 mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Debt Management</h1>
                <p className="text-gray-600 mt-1">Track and manage your debt obligations</p>
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
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
                onClick={() => setOpenedCreate(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Debt
              </button>

              <select
                className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter by type"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading debt data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <DebtOverview
              debtStatus={debtStatus}
              debts={debts}
              onPayment={handleRecordPayment}
              onEdit={(debt) => {
                setEditingDebt(debt)
                setEditForm({
                  description: debt.description || "",
                  creditor: debt.creditor || "",
                  balance: debt.balance?.toString() || "",
                  interestRate: debt.interestRate?.toString() || "",
                  minimumPayment: debt.minimumPayment?.toString() || "",
                  dueDate: debt.dueDate ? new Date(debt.dueDate).toISOString().split("T")[0] : "",
                })
                setOpenedEdit(true)
              }}
              onDelete={(id) => {
                setDeleteDebtId(id)
                setOpenedDelete(true)
              }}
            />

            <DebtChart debts={debts} />

            <RepaymentStrategy strategies={repaymentStrategies} />
          </div>
        )}

        {/* Modals */}
        <CreateDebtModal
          isOpen={openedCreate}
          onClose={() => setOpenedCreate(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleCreateDebt}
        />

        <EditDebtModal
          isOpen={openedEdit}
          onClose={() => setOpenedEdit(false)}
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleEditDebt}
        />

        <DeleteDebtModal isOpen={openedDelete} onClose={() => setOpenedDelete(false)} onConfirm={handleDeleteDebt} />
      </div>
    </div>
  )
}