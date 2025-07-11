import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SidebarItem = ({ to, icon, label, count, isActive }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 group",
        (linkActive || isActive) && "bg-primary/10 text-primary border-r-2 border-primary"
      )}
    >
      <ApperIcon name={icon} className="h-5 w-5" />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-1 min-w-[1.5rem] text-center">
          {count}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;