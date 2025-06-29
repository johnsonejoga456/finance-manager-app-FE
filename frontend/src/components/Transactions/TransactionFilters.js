"use client"

export default function TransactionFilters({
  categories,
  subTypes,
  filterCategory,
  setFilterCategory,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterNotes,
  setFilterNotes,
  filterType,
  setFilterType,
  filterTags,
  setFilterTags,
  transactions,
  handleCSVImport,
  handleExport,
  openAdd,
}) {
  const allTags = Array.isArray(transactions)
    ? [...new Set(transactions.flatMap((t) => t.tags || []))].filter(Boolean)
    : []

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter & Manage Transactions
        </h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Filter Controls */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label htmlFor="filterCategory" className="block text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                id="filterCategory"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label htmlFor="filterType" className="block text-sm font-semibold text-gray-700">
                Transaction Type
              </label>
              <select
                id="filterType"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter by type"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2">
              <label htmlFor="filterTags" className="block text-sm font-semibold text-gray-700">
                Tags
              </label>
              <select
                id="filterTags"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={filterTags}
                onChange={(e) => setFilterTags(e.target.value)}
                aria-label="Filter by tags"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <label htmlFor="filterStartDate" className="block text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                id="filterStartDate"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                aria-label="Filter by start date"
              />
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <label htmlFor="filterEndDate" className="block text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                id="filterEndDate"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                aria-label="Filter by end date"
              />
            </div>

            {/* Notes Search */}
            <div className="space-y-2">
              <label htmlFor="filterNotes" className="block text-sm font-semibold text-gray-700">
                Search Notes
              </label>
              <div className="relative">
                <input
                  id="filterNotes"
                  className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Search in notes..."
                  value={filterNotes}
                  onChange={(e) => setFilterNotes(e.target.value)}
                  aria-label="Search by notes"
                />
                <svg
                  className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="xl:col-span-1 space-y-4">
          <div className="space-y-2">
            <label htmlFor="csvImport" className="block text-sm font-semibold text-gray-700">
              Import Data
            </label>
            <input
              id="csvImport"
              type="file"
              accept=".csv"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => handleCSVImport(e.target.files[0])}
              aria-label="Import CSV file"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              onClick={openAdd}
              type="button"
              aria-label="Add new transaction"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              onClick={() => handleExport("csv")}
              type="button"
              aria-label="Export transactions as CSV"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              onClick={() => handleExport("pdf")}
              type="button"
              aria-label="Export transactions as PDF"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  )
}