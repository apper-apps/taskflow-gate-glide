import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import QuickAddBar from "@/components/molecules/QuickAddBar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import ProjectDot from "@/components/molecules/ProjectDot";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      const currentProject = projectsData.find(p => p.Id === parseInt(projectId));
      if (!currentProject) {
        throw new Error("Project not found");
      }
      
      // Filter tasks for this project (not completed)
      const projectTasks = tasksData.filter(task => 
        task.projectId === currentProject.Id && !task.completed
      );
      
      setTasks(projectTasks);
      setProject(currentProject);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || "Failed to load project");
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [projectId]);
  
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        projectId: project.Id
      });
      
      if (!newTask.completed) {
        setTasks(prev => [newTask, ...prev]);
      }
      
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task");
    }
  };
  
  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      });
      
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task completed! 🎉");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };
  
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        
        // Check if task still belongs to this project
        if (!updatedTask.completed && updatedTask.projectId === project.Id) {
          setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t));
        } else {
          setTasks(prev => prev.filter(t => t.Id !== editingTask.Id));
        }
        
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create({
          ...taskData,
          projectId: project.Id
        });
        
        if (!newTask.completed) {
          setTasks(prev => [newTask, ...prev]);
        }
        
        toast.success("Task created successfully!");
      }
      
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to save task");
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully!");
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
          <ProjectDot color={project.color} />
          <h1 className="text-3xl font-bold font-display text-gray-900">{project.Name}</h1>
          <span className="text-sm text-gray-500">({tasks.length} tasks)</span>
        </div>
        
        <QuickAddBar onAddTask={handleAddTask} projects={projects} />
      </motion.div>
      
      <TaskList
        tasks={tasks}
        projects={projects}
        onToggleComplete={handleToggleComplete}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
emptyMessage={`No tasks in ${project.Name}. Add a task to get started!`}
      />
      
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projects={projects}
          onSave={handleSaveTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectPage;