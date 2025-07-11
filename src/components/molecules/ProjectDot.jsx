import { cn } from "@/utils/cn";

const ProjectDot = ({ color, className }) => {
  return (
    <div 
      className={cn("w-3 h-3 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
};

export default ProjectDot;