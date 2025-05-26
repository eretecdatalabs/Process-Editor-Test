export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border border-gray-300 rounded px-2 py-1 text-sm ${className}`}
      {...props}
    />
  );
}