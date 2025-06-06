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
    : [];

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Transactions</h3>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* Filter Inputs */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Category Filter */}
            <div>
              <label htmlFor="filterCategory" className="block mb-1 text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                id="filterCategory"
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Start Date Filter */}
            <div>
              <label htmlFor="filterStartDate" className="block mb-1 text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                id="filterStartDate"
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                aria-label="Filter by start date"
              />
            </div>
            {/* End Date Filter */}
            <div>
              <label htmlFor="filterEndDate" className="block mb-1 text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                id="filterEndDate"
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                aria-label="Filter by end date"
              />
            </div>
            {/* Notes Filter */}
            <div>
              <label htmlFor="filterNotes" className="block mb-1 text-sm font-semibold text-gray-700">
                Notes
              </label>
              <input
                id="filterNotes"
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                type="text"
                placeholder="Search notes"
                value={filterNotes}
                onChange={(e) => setFilterNotes(e.target.value)}
                aria-label="Search by notes"
              />
            </div>
            {/* Type Filter */}
            <div>
              <label htmlFor="filterType" className="block mb-1 text-sm font-semibold text-gray-700">
                Type
              </label>
              <select
                id="filterType"
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
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
            <div>
              <label htmlFor="filterTags" className="block mb-1 text-sm font-semibold text-gray-700">
                Tags
              </label>
              <select
                id="filterTags"
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterTags}
                onChange={(e) => setFilterTags(e.target.value)}
                aria-label="Filter by tags"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 sm:flex-row sm:gap-3 md:flex-col md:items-start">
          <div className="w-full">
            <label htmlFor="csvImport" className="block mb-1 text-sm font-semibold text-gray-700">
              Import CSV
            </label>
            <input
              id="csvImport"
              type="file"
              accept=".csv"
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleCSVImport(e.target.files[0])}
              aria-label="Import CSV file"
            />
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto"
            onClick={openAdd}
            type="button"
            aria-label="Add new transaction"
          >
            <span className="mr-1 text-lg">+</span> Add
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto"
            onClick={() => handleExport('csv')}
            type="button"
            aria-label="Export transactions as CSV"
          >
            Export CSV
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto"
            onClick={() => handleExport('pdf')}
            type="button"
            aria-label="Export transactions as PDF"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}