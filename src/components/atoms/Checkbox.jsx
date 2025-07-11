import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "h-5 w-5 rounded border-2 border-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        checked ? "bg-primary border-primary" : "bg-white hover:border-primary",
        className
      )}
      {...props}
    >
      {checked && (
        <ApperIcon name="Check" className="h-3 w-3 text-white" />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;