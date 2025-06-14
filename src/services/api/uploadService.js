const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const uploadService = {
  async startSession(files) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Upload Session ${Date.now()}`,
          total_files: files.length,
          total_size: files.reduce((sum, file) => sum + file.size, 0),
          uploaded_count: 0,
          failed_count: 0,
          start_time: new Date().toISOString(),
          status: 'active',
          Tags: null,
          Owner: null
        }]
      };
      
      const response = await apperClient.createRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create upload session:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create upload session');
        }
        
        return response.results[0].data;
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error("Error starting upload session:", error);
      throw error;
    }
  },

  async updateSession(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields + Id
      const updateRecord = { Id: id };
      
      if (updateData.total_files !== undefined) updateRecord.total_files = updateData.total_files;
      if (updateData.total_size !== undefined) updateRecord.total_size = updateData.total_size;
      if (updateData.uploaded_count !== undefined) updateRecord.uploaded_count = updateData.uploaded_count;
      if (updateData.failed_count !== undefined) updateRecord.failed_count = updateData.failed_count;
      if (updateData.start_time !== undefined) updateRecord.start_time = updateData.start_time;
      if (updateData.status !== undefined) updateRecord.status = updateData.status;
      if (updateData.Name !== undefined) updateRecord.Name = updateData.Name;
      if (updateData.Tags !== undefined) updateRecord.Tags = updateData.Tags;
      if (updateData.Owner !== undefined) updateRecord.Owner = updateData.Owner;
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await apperClient.updateRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update upload session:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update upload session');
        }
        
        return response.results[0].data;
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error("Error updating upload session:", error);
      throw error;
    }
  },

  async simulateUpload(fileId, onProgress) {
    // Simulate upload progress
    const totalSteps = 20
    const stepDelay = 100
    
    for (let i = 0; i <= totalSteps; i++) {
      await delay(stepDelay)
      const progress = (i / totalSteps) * 100
      onProgress(progress)
      
      // Simulate occasional upload failures
      if (Math.random() < 0.1 && i > 10) {
        throw new Error('Upload failed')
      }
    }
    
    return {
      fileId,
      uploadedAt: new Date().toISOString(),
      status: 'completed'
    }
  },

  async getAcceptedTypes() {
    await delay(100)
    return {
      images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
      documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
      archives: ['.zip', '.rar', '.7z', '.tar.gz'],
      videos: ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
      audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg']
    }
  }
}

export default uploadService