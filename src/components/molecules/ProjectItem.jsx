import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ProjectDot from "@/components/molecules/ProjectDot";

const ProjectItem = ({ project, taskCount, isActive }) => {
  const [isHover, setIsHover] = useState(false);
  
  return (
    <NavLink
      to={`/projects/${project.Id}`}
      className={({ isActive: linkActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 group",
        (linkActive || isActive) && "bg-primary/10 text-primary border-r-2 border-primary"
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <ProjectDot color={project.color} />
      <span className="flex-1 truncate">{project.name}</span>
      {taskCount > 0 && (
        <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-1 min-w-[1.5rem] text-center">
          {taskCount}
        </span>
      )}
    </NavLink>
  );
};

export default ProjectItem;