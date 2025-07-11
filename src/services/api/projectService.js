class ProjectService {
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
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "order" } },
          { field: { Name: "task_count" } },
          { field: { Name: "is_archived" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "order" } },
          { field: { Name: "task_count" } },
          { field: { Name: "is_archived" } }
        ]
      };

      const response = await this.apperClient.getRecordById("project", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Project not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  async create(projectData) {
    try {
      const params = {
        records: [{
          Name: projectData.name,
          color: projectData.color || "#5B4AE4",
          order: 0,
          task_count: 0,
          is_archived: false
        }]
      };

      const response = await this.apperClient.createRecord("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create project");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.name && { Name: updateData.name }),
          ...(updateData.color && { color: updateData.color }),
          ...(updateData.order !== undefined && { order: updateData.order }),
          ...(updateData.task_count !== undefined && { task_count: updateData.task_count }),
          ...(updateData.is_archived !== undefined && { is_archived: updateData.is_archived })
        }]
      };

      const response = await this.apperClient.updateRecord("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update project");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete project");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();