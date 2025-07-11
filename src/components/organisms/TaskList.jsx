import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "@/components/molecules/TaskItem";
import Empty from "@/components/ui/Empty";

const TaskList = ({ tasks, projects, onToggleComplete, onEditTask, onDeleteTask, emptyMessage }) => {
  const getTaskProject = (taskProjectId) => {
    return projects.find(p => p.Id === taskProjectId);
  };
  
  if (tasks.length === 0) {
    return <Empty message={emptyMessage} />;
  }
  
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map(task => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <TaskItem
              task={task}
              project={getTaskProject(task.projectId)}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;