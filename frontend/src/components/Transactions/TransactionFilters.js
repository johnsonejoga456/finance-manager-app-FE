
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
    <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
      <div className="flex flex-wrap gap-2">
        <select
          className="border rounded px-2 py-1 w-full sm:w-48 bg-white text-gray-700"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Filter by category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 w-full sm:w-36 bg-white text-gray-700"
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 w-full sm:w-36 bg-white text-gray-700"
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 w-full sm:w-48 bg-white text-gray-700"
          type="text"
          placeholder="Search by notes"
          value={filterNotes}
          onChange={(e) => setFilterNotes(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1 w-full sm:w-36 bg-white text-gray-700"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Filter by type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
          <option value="investment">Investment</option>
        </select>
        <select
          className="border rounded px-2 py-1 w-full sm:w-36 bg-white text-gray-700"
          value={filterTags}
          onChange={(e) => setFilterTags(e.target.value)}
        >
          <option value="">Filter by tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <input
          type="file"
          accept=".csv"
          className="block border rounded px-2 py-1 w-full sm:w-36 bg-white text-gray-700"
          onChange={handleCSVImport}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center"
          onClick={openAdd}
          type="button"
        >
          <span className="mr-1 text-lg">+</span> Add Transaction
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          onClick={() => handleExport('csv')}
          type="button"
        >
          Export CSV
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
          onClick={() => handleExport('pdf')}
          type="button"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}