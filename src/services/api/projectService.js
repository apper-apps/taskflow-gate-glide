import mockProjects from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...mockProjects];
  }

  async getAll() {
    await this.delay();
    return [...this.projects];
  }

  async getById(id) {
    await this.delay();
    const project = this.projects.find(p => p.Id === parseInt(id));
    if (!project) throw new Error("Project not found");
    return { ...project };
  }

  async create(projectData) {
    await this.delay();
    const newProject = {
      Id: this.getNextId(),
      name: projectData.name,
      color: projectData.color || "#5B4AE4",
      order: this.projects.length,
      taskCount: 0,
      isArchived: false
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Project not found");
    
    this.projects[index] = { ...this.projects[index], ...updateData };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Project not found");
    
    this.projects.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.projects.map(p => p.Id), 0) + 1;
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const projectService = new ProjectService();