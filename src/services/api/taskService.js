import mockTasks from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    return { ...task };
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      Id: this.getNextId(),
      title: taskData.title,
      description: taskData.description || "",
      projectId: taskData.projectId || null,
      priority: taskData.priority || "normal",
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date(),
      order: this.tasks.length
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.tasks.map(t => t.Id), 0) + 1;
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const taskService = new TaskService();