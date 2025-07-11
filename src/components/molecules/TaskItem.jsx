import { motion } from "framer-motion";
import { useState } from "react";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import PriorityFlag from "@/components/molecules/PriorityFlag";
import ProjectDot from "@/components/molecules/ProjectDot";
import ApperIcon from "@/components/ApperIcon";
import { formatDate, isOverdue } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, project, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const handleToggleComplete = async () => {
    setIsCompleting(true);
    
    // Show completion animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onToggleComplete(task.Id);
    setIsCompleting(false);
  };
  
  const overdue = isOverdue(task.dueDate);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200",
        isCompleting && "animate-confetti",
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        <PriorityFlag priority={task.priority} className="flex-shrink-0 mt-1" />
        
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          className="flex-shrink-0 mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium text-gray-900 truncate",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            {project && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <ProjectDot color={project.color} />
                <span className="text-xs text-gray-500">{project.name}</span>
              </div>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs">
            {task.dueDate && (
              <Badge variant={overdue ? "error" : "default"}>
                <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                {formatDate(task.dueDate)}
              </Badge>
            )}
            
            <Badge variant={task.priority}>
              {task.priority}
            </Badge>
          </div>
        </div>
        
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.Id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskItem;