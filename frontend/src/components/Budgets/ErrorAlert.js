import PropTypes from 'prop-types';

export default function ErrorAlert({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
      <span>{error}</span>
      <button onClick={onClose} className="text-red-700 hover:text-red-900">
        &times;
      </button>
    </div>
  );
}

ErrorAlert.propTypes = {
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};