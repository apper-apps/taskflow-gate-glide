import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";

const ArchivePage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      // Filter completed tasks
      const completedTasks = tasksData.filter(task => task.completed);
      
      setTasks(completedTasks);
      setFilteredTasks(completedTasks);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || "Failed to load archive");
      toast.error("Failed to load archive");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTasks(filtered);
  }, [searchTerm, tasks]);
  
  const handleRestoreTask = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        completed: false,
        completedAt: null
      });
      
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      setFilteredTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task restored successfully!");
    } catch (err) {
      toast.error("Failed to restore task");
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to permanently delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(t => t.Id !== taskId));
        setFilteredTasks(prev => prev.filter(t => t.Id !== taskId));
        toast.success("Task deleted permanently!");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="Archive" className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-display text-gray-900">Archive</h1>
          <span className="text-sm text-gray-500">({tasks.length} completed tasks)</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search completed tasks..."
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="text-gray-500"
            >
              Clear
            </Button>
          )}
        </div>
      </motion.div>
      
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-success rounded border-2 border-success flex items-center justify-center flex-shrink-0 mt-1">
                <ApperIcon name="Check" className="h-3 w-3 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-500 line-through truncate">
                    {task.title}
                  </h3>
                  {task.projectId && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: projects.find(p => p.Id === task.projectId)?.color }}
                      />
                      <span className="text-xs text-gray-500">
                        {projects.find(p => p.Id === task.projectId)?.name}
                      </span>
                    </div>
                  )}
                </div>
                
                {task.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="text-xs text-gray-400">
                  Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ""}
                </div>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRestoreTask(task.Id)}
                  className="h-8 w-8 p-0 text-primary hover:text-primary-dark"
                  title="Restore task"
                >
                  <ApperIcon name="Undo" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.Id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  title="Delete permanently"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredTasks.length === 0 && tasks.length > 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No tasks found matching "{searchTerm}"</p>
        </div>
      )}
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Archive" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No completed tasks in archive</p>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;