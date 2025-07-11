import { cn } from "@/utils/cn";

const PriorityFlag = ({ priority, className }) => {
  const colors = {
    urgent: "bg-red-500",
    high: "bg-orange-500",
    normal: "bg-blue-500",
    low: "bg-gray-400"
  };
  
  if (priority === "low") return null;
  
  return (
    <div className={cn("w-1 h-6 rounded-full", colors[priority], className)} />
  );
};

export default PriorityFlag;