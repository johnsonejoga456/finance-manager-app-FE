export default function RepaymentStrategy({ strategies }) {
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Repayment Strategies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-md font-semibold mb-2">Debt Snowball (Lowest Balance First)</h4>
          {strategies.snowball.length ? (
            <ul className="list-disc pl-5">
              {strategies.snowball.map(s => (
                <li key={s.id} className="text-gray-600">
                  {s.description} (${s.balance.toFixed(2)}): {s.paymentPriority}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No debts available</p>
          )}
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2">Debt Avalanche (Highest Interest First)</h4>
          {strategies.avalanche.length ? (
            <ul className="list-disc pl-5">
              {strategies.avalanche.map(s => (
                <li key={s.id} className="text-gray-600">
                  {s.description} (${s.balance.toFixed(2)}): {s.paymentPriority}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No debts available</p>
          )}
        </div>
      </div>
    </div>
  );
}