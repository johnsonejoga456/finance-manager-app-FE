export default function ErrorAlert({ error, onClose }) {
  if (!error) return null;
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex justify-between items-center" role="alert">
      <span>{error}</span>
      <button className="text-red-700" onClick={onClose}>✕</button>
    </div>
  );
}