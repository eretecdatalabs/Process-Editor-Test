export function Button({ children, className = "", variant = "default", size = "md", ...props }) {
  const baseStyle = "rounded px-3 py-1 text-sm font-medium border";
  const variants = {
    default: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
    destructive: "bg-red-500 text-white border-red-500 hover:bg-red-600",
    ghost: "bg-transparent border-none hover:bg-gray-100",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}