import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { parseNaturalLanguage } from "@/utils/dateUtils";

const QuickAddBar = ({ onAddTask, projects }) => {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const dueDate = parseNaturalLanguage(title);
    
    onAddTask({
      title: title.trim(),
      projectId: projectId || null,
      priority,
      dueDate
    });
    
    setTitle("");
    setProjectId("");
    setPriority("normal");
    setIsExpanded(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a task... (try 'Review report tomorrow')"
            className="flex-1"
          />
          <Button type="submit" disabled={!title.trim()}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {isExpanded && (
          <div className="flex gap-2 animate-fade-in">
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex-1"
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.Id} value={project.Id}>
                  {project.name}
                </option>
              ))}
            </Select>
            
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-32"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuickAddBar;