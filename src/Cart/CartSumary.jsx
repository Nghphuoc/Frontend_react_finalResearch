const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between mb-2 text-gray-700">
    <span>{label}:</span>
    <span>{value}</span>
  </div>
);

export default SummaryRow;