const fileService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'size', 'type', 'status', 'progress', 'uploaded_at', 'preview', 'file', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await apperClient.fetchRecords('file', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: ['Name', 'size', 'type', 'status', 'progress', 'uploaded_at', 'preview', 'file', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await apperClient.getRecordById('file', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching file with ID ${id}:`, error);
      throw error;
    }
  },

  async create(fileData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: fileData.name,
          size: fileData.size,
          type: fileData.type,
          status: fileData.status || 'pending',
          progress: fileData.progress || 0,
          uploaded_at: fileData.uploaded_at || null,
          preview: fileData.preview || null,
          file: fileData.file || null,
          Tags: fileData.Tags || null,
          Owner: fileData.Owner || null
        }]
      };
      
      const response = await apperClient.createRecord('file', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create file record:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create file');
        }
        
        return response.results[0].data;
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields + Id
      const updateRecord = { Id: id };
      
      if (updateData.name !== undefined) updateRecord.Name = updateData.name;
      if (updateData.size !== undefined) updateRecord.size = updateData.size;
      if (updateData.type !== undefined) updateRecord.type = updateData.type;
      if (updateData.status !== undefined) updateRecord.status = updateData.status;
      if (updateData.progress !== undefined) updateRecord.progress = updateData.progress;
      if (updateData.uploaded_at !== undefined) updateRecord.uploaded_at = updateData.uploaded_at;
      if (updateData.preview !== undefined) updateRecord.preview = updateData.preview;
      if (updateData.file !== undefined) updateRecord.file = updateData.file;
      if (updateData.Tags !== undefined) updateRecord.Tags = updateData.Tags;
      if (updateData.Owner !== undefined) updateRecord.Owner = updateData.Owner;
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await apperClient.updateRecord('file', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update file record:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update file');
        }
        
        return response.results[0].data;
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('file', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete file record:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete file');
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  async clear() {
    try {
      // Get all files first
      const files = await this.getAll();
      
      if (files.length === 0) {
        return true;
      }
      
      // Delete all files
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: files.map(f => f.Id)
      };
      
      const response = await apperClient.deleteRecord('file', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing files:", error);
      throw error;
    }
  }
}

export default fileService