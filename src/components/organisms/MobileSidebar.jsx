import { motion } from "framer-motion";
import { useState } from "react";
import SidebarItem from "@/components/molecules/SidebarItem";
import ProjectItem from "@/components/molecules/ProjectItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose, projects, taskCounts, onNewProject }) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-50 overflow-y-auto lg:hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold font-display text-gray-900">TaskFlow</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem
              to="/inbox"
              icon="Inbox"
              label="Inbox"
              count={taskCounts.inbox}
            />
            <SidebarItem
              to="/today"
              icon="Calendar"
              label="Today"
              count={taskCounts.today}
            />
            <SidebarItem
              to="/upcoming"
              icon="CalendarDays"
              label="Upcoming"
              count={taskCounts.upcoming}
            />
          </nav>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ApperIcon
                  name="ChevronRight"
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isProjectsExpanded && "rotate-90"
                  )}
                />
                Projects
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewProject}
                className="h-6 w-6 p-0"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            
            {isProjectsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1"
              >
                {projects.map(project => (
                  <ProjectItem
                    key={project.Id}
                    project={project}
                    taskCount={taskCounts.projects[project.Id] || 0}
                  />
                ))}
              </motion.div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <SidebarItem
              to="/archive"
              icon="Archive"
              label="Archive"
              count={taskCounts.archive}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileSidebar;