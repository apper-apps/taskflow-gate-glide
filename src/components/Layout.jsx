import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { isAfter, isToday, startOfDay } from "date-fns";
import { toast } from "react-toastify";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import ProjectModal from "@/components/organisms/ProjectModal";
import Button from "@/components/atoms/Button";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
const Layout = () => {
  const { logout } = useContext(AuthContext);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    inbox: 0,
    today: 0,
    upcoming: 0,
    archive: 0,
    projects: {}
  });
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      setProjects(projectsData);
      
      // Calculate task counts
      const counts = {
        inbox: tasksData.filter(t => !t.projectId && !t.completed).length,
        today: tasksData.filter(t => {
          if (t.completed || !t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return isToday(dueDate) || dueDate < new Date();
        }).length,
        upcoming: tasksData.filter(t => {
          if (t.completed || !t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return isAfter(dueDate, startOfDay(new Date()));
        }).length,
        archive: tasksData.filter(t => t.completed).length,
        projects: {}
      };
      
// Calculate project task counts
      projectsData.forEach(project => {
        counts.projects[project.Id] = tasksData.filter(t => 
          t.projectId === project.Id && !t.completed
        ).length;
      });
      
      setTaskCounts(counts);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };
  
  const handleNewProject = () => {
    setShowProjectModal(true);
  };
  
  const handleSaveProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowProjectModal(false);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error("Failed to create project");
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          projects={projects}
          taskCounts={taskCounts}
          onNewProject={handleNewProject}
        />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        projects={projects}
        taskCounts={taskCounts}
        onNewProject={handleNewProject}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
<Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="h-8 w-8 p-0"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-light rounded-md flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold font-display text-gray-900">TaskFlow</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="h-8 px-3 text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="LogOut" className="h-4 w-4" />
          </Button>
        </div>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      {/* Project Modal */}
      {showProjectModal && (
        <ProjectModal
          onSave={handleSaveProject}
          onClose={() => setShowProjectModal(false)}
        />
      )}
    </div>
  );
};

export default Layout;