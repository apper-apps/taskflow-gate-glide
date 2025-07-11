class TaskService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        priority: task.priority,
        dueDate: task.due_date,
        completed: Array.isArray(task.completed) ? task.completed.includes('completed') : Boolean(task.completed),
        completedAt: task.completed_at,
        createdAt: task.created_at,
        order: task.order
      }));

      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ]
      };

      const response = await this.apperClient.getRecordById("task", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Task not found");
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        priority: task.priority,
        dueDate: task.due_date,
        completed: Array.isArray(task.completed) ? task.completed.includes('completed') : Boolean(task.completed),
        completedAt: task.completed_at,
        createdAt: task.created_at,
        order: task.order
      };
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          title: taskData.title,
          description: taskData.description || "",
          project_id: taskData.projectId || null,
          priority: taskData.priority || "normal",
          due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : null,
          completed: "",
          completed_at: null,
          created_at: new Date().toISOString(),
          order: 0
        }]
      };

      const response = await this.apperClient.createRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create task");
        }
        
        const task = successfulRecords[0]?.data;
        return {
          Id: task.Id,
          title: task.title,
          description: task.description,
          projectId: task.project_id,
          priority: task.priority,
          dueDate: task.due_date,
          completed: false,
          completedAt: task.completed_at,
          createdAt: task.created_at,
          order: task.order
        };
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.title && { title: updateData.title }),
          ...(updateData.description !== undefined && { description: updateData.description }),
          ...(updateData.projectId !== undefined && { project_id: updateData.projectId }),
          ...(updateData.priority && { priority: updateData.priority }),
          ...(updateData.dueDate !== undefined && { 
            due_date: updateData.dueDate ? new Date(updateData.dueDate).toISOString().split('T')[0] : null 
          }),
          ...(updateData.completed !== undefined && { 
            completed: updateData.completed ? "completed" : "" 
          }),
          ...(updateData.completedAt !== undefined && { 
            completed_at: updateData.completedAt ? new Date(updateData.completedAt).toISOString() : null 
          }),
          ...(updateData.order !== undefined && { order: updateData.order })
        }]
      };

      const response = await this.apperClient.updateRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update task");
        }
        
        const task = successfulUpdates[0]?.data;
        return {
          Id: task.Id,
          title: task.title,
          description: task.description,
          projectId: task.project_id,
          priority: task.priority,
          dueDate: task.due_date,
          completed: Array.isArray(task.completed) ? task.completed.includes('completed') : Boolean(task.completed),
          completedAt: task.completed_at,
          createdAt: task.created_at,
          order: task.order
        };
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete task");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();