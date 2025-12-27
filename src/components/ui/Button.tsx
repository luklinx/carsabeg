import { cn } from "@/lib/utils"; // optional helper for merging classNames

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-black text-white hover:bg-gray-900 focus:ring-gray-700",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
