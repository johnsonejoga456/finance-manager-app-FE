"use client"

import { useState, useEffect, useCallback } from "react"
import accountService from "../services/accountService"
import TransactionsModal from "../components/Transactions/TransactionModals"
import ErrorAlert from "../components/Budgets/ErrorAlert"
import CreateAccountModal from "../components/Accounts/CreateAccountModal"
import EditAccountModal from "../components/Accounts/EditAccountModal"
import DeleteAccountModal from "../components/Accounts/DeleteAccountModal"
import {
  Wallet,
  Plus,
  Filter,
  Download,
  FileText,
  Eye,
  RefreshCw,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Banknote,
  Home,
  Loader2,
} from "lucide-react"

const accountTypes = [
  { value: "checking", label: "Checking Account", icon: Building2, color: "text-blue-600" },
  { value: "savings", label: "Savings Account", icon: PiggyBank, color: "text-emerald-600" },
  { value: "credit card", label: "Credit Card", icon: CreditCard, color: "text-red-600" },
  { value: "investment", label: "Investment Account", icon: TrendingUp, color: "text-purple-600" },
  { value: "loan", label: "Loan Account", icon: Home, color: "text-orange-600" },
  { value: "cash", label: "Cash Account", icon: Banknote, color: "text-green-600" },
]

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([])
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openedCreate, setOpenedCreate] = useState(false)
  const [openedEdit, setOpenedEdit] = useState(false)
  const [openedDelete, setOpenedDelete] = useState(false)
  const [openedTransactions, setOpenedTransactions] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [deleteAccountId, setDeleteAccountId] = useState(null)
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [filterType, setFilterType] = useState("")
  const [currentAccountPage, setCurrentAccountPage] = useState(1)
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [updatingBalance, setUpdatingBalance] = useState(null)

  const accountsPerPage = 10
  const transactionsPerPage = 5

  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
    currency: "USD",
    institution: "",
    notes: "",
  })

  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    balance: "",
    currency: "USD",
    institution: "",
    notes: "",
  })

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true)
      const { accounts, total } = await accountService.getAccounts({
        page: currentAccountPage,
        limit: accountsPerPage,
      })

      setAccounts(accounts || [])
      setFilteredAccounts(accounts || [])
      setTotalAccounts(total || 0)
      setError(null)
    } catch (err) {
      console.error("Fetch accounts error:", err.message)
      setError(err.message || "Failed to fetch accounts")
      setAccounts([])
      setFilteredAccounts([])
      setTotalAccounts(0)
    } finally {
      setLoading(false)
    }
  }, [currentAccountPage])

  const fetchTransactionsForAccount = useCallback(
    async (account) => {
      try {
        setLoadingTransactions(true)
        const { transactions, total } = await accountService.getAccountTransactions(account._id, {
          page: currentTransactionPage,
          limit: transactionsPerPage,
        })

        setTransactions(transactions || [])
        setTotalTransactions(total || 0)
        setSelectedAccountId(account._id)
        setOpenedTransactions(true)
        setError(null)
      } catch (err) {
        console.error("Fetch transactions error:", err.message)
        setError(err.message || "Failed to fetch transactions")
        setTransactions([])
        setTotalTransactions(0)
      } finally {
        setLoadingTransactions(false)
      }
    },
    [currentTransactionPage],
  )

  const handleCreateAccount = useCallback(async () => {
    if (!form.name || !form.type || !form.balance || !form.currency) {
      setError("All required fields must be filled")
      return
    }

    try {
      await accountService.addAccount({
        ...form,
        balance: Number.parseFloat(form.balance),
      })
      await fetchAccounts()
      setForm({
        name: "",
        type: "",
        balance: "",
        currency: "USD",
        institution: "",
        notes: "",
      })
      setOpenedCreate(false)
      setError(null)
    } catch (err) {
      console.error("Create account error:", err.message)
      setError(err.message || "Failed to create account")
    }
  }, [form, fetchAccounts])

  const handleEditAccount = useCallback(async () => {
    if (!editForm.name || !editForm.type || !editForm.balance || !editForm.currency) {
      setError("All required fields must be filled")
      return
    }

    try {
      await accountService.updateAccount(editingAccount._id, {
        ...editForm,
        balance: Number.parseFloat(editForm.balance),
      })
      await fetchAccounts()
      setEditForm({
        name: "",
        type: "",
        balance: "",
        currency: "USD",
        institution: "",
        notes: "",
      })
      setOpenedEdit(false)
      setEditingAccount(null)
      setError(null)
    } catch (err) {
      console.error("Error updating account:", err.message)
      setError(err.message || "Failed to update account")
    }
  }, [editForm, editingAccount, fetchAccounts])

  const handleDeleteAccount = useCallback(
    async (cascade) => {
      try {
        await accountService.deleteAccount(deleteAccountId, cascade)
        await fetchAccounts()
        setOpenedDelete(false)
        setDeleteAccountId(null)
        setError(null)
      } catch (err) {
        console.error("Error deleting account:", err.message)
        setError(err.message || "Failed to delete account")
      }
    },
    [deleteAccountId, fetchAccounts],
  )

  const handleUpdateBalance = useCallback(
    async (accountId) => {
      try {
        setUpdatingBalance(accountId)
        await accountService.updateBalance(accountId)
        await fetchAccounts()
        if (openedTransactions && selectedAccountId === accountId) {
          await fetchTransactionsForAccount({ _id: accountId })
        }
        setError(null)
      } catch (err) {
        console.error("Update balance error:", err.message)
        setError(err.message || "Failed to update balance")
      } finally {
        setUpdatingBalance(null)
      }
    },
    [openedTransactions, selectedAccountId, fetchAccounts, fetchTransactionsForAccount],
  )

  const handleExportCSV = useCallback(async () => {
    try {
      await accountService.exportToCSV()
      setError(null)
    } catch (err) {
      console.error("Export accounts error:", err.message)
      setError(err.message || "Failed to export accounts")
    }
  }, [])

  const handleExportPDF = useCallback(async () => {
    try {
      await accountService.exportToPDF()
      setError(null)
    } catch (err) {
      console.error("Export PDF error:", err.message)
      setError(err.message || "Failed to export PDF")
    }
  }, [])

  const handleFilterType = useCallback(
    (type) => {
      setFilterType(type)
      if (type && Array.isArray(accounts)) {
        setFilteredAccounts(accounts.filter((acc) => acc.type === type))
      } else {
        setFilteredAccounts(accounts || [])
      }
    },
    [accounts],
  )

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  useEffect(() => {
    handleFilterType(filterType)
  }, [accounts, filterType, handleFilterType])

  const totalAccountPages = Math.ceil(totalAccounts / accountsPerPage)

  const getAccountTypeInfo = (type) => {
    return accountTypes.find((t) => t.value === type) || accountTypes[0]
  }

  const getTotalBalance = () => {
    return filteredAccounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Account Management</h1>
              <p className="text-gray-600">Manage your financial accounts and track balances</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-800">{filteredAccounts.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${getTotalBalance().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <PiggyBank className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Filter</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filterType ? accountTypes.find((t) => t.value === filterType)?.label || "All" : "All"}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ErrorAlert error={error} onClose={() => setError(null)} />

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setOpenedCreate(true)}
              >
                <Plus className="h-5 w-5" />
                <span>Add Account</span>
              </button>

              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={filterType}
                  onChange={(e) => handleFilterType(e.target.value)}
                  aria-label="Filter by account type"
                >
                  <option value="">All Account Types</option>
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                onClick={handleExportPDF}
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading accounts...</p>
          </div>
        ) : Array.isArray(filteredAccounts) && filteredAccounts.length ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => {
                    const typeInfo = getAccountTypeInfo(account.type)
                    const IconComponent = typeInfo.icon

                    return (
                      <tr key={account._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gray-100`}>
                              <IconComponent className={`h-5 w-5 ${typeInfo.color}`} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{account.name}</div>
                              <div className="text-xs text-gray-500">{account.currency}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-800">
                            ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.institution || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                              onClick={() => fetchTransactionsForAccount(account)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </button>

                            <button
                              className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                              onClick={() => handleUpdateBalance(account._id)}
                              disabled={updatingBalance === account._id}
                            >
                              {updatingBalance === account._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              <span>Update</span>
                            </button>

                            <button
                              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200"
                              onClick={() => {
                                setEditingAccount(account)
                                setEditForm({
                                  name: account.name,
                                  type: account.type,
                                  balance: account.balance.toString(),
                                  currency: account.currency,
                                  institution: account.institution || "",
                                  notes: account.notes || "",
                                })
                                setOpenedEdit(true)
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                              <span>Edit</span>
                            </button>

                            <button
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                              onClick={() => {
                                setDeleteAccountId(account._id)
                                setOpenedDelete(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalAccountPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentAccountPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentAccountPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-sm text-gray-700 px-4">
                    Page {currentAccountPage} of {totalAccountPages}
                  </span>

                  <button
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentAccountPage((prev) => Math.min(prev + 1, totalAccountPages))}
                    disabled={currentAccountPage === totalAccountPages}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {(currentAccountPage - 1) * accountsPerPage + 1} to{" "}
                  {Math.min(currentAccountPage * accountsPerPage, totalAccounts)} of {totalAccounts} accounts
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No accounts found</h3>
            <p className="text-gray-500 mb-6">
              {filterType
                ? `No ${accountTypes.find((t) => t.value === filterType)?.label.toLowerCase()} accounts found.`
                : "Get started by adding your first account."}
            </p>
            <button
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg mx-auto"
              onClick={() => setOpenedCreate(true)}
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Account</span>
            </button>
          </div>
        )}

        {/* Modals */}
        <CreateAccountModal
          isOpen={openedCreate}
          onClose={() => setOpenedCreate(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleCreateAccount}
        />

        <EditAccountModal
          isOpen={openedEdit}
          onClose={() => setOpenedEdit(false)}
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleEditAccount}
        />

        <DeleteAccountModal
          isOpen={openedDelete}
          onClose={() => setOpenedDelete(false)}
          onConfirm={handleDeleteAccount}
        />

        <TransactionsModal
          isOpen={openedTransactions}
          onClose={() => {
            setOpenedTransactions(false)
            setTransactions([])
            setTotalTransactions(0)
          }}
          transactions={transactions}
          totalTransactions={totalTransactions}
          currentPage={currentTransactionPage}
          setCurrentPage={setCurrentTransactionPage}
          transactionsPerPage={transactionsPerPage}
          loading={loadingTransactions}
          accountId={selectedAccountId}
        />
      </div>
    </div>
  )
}