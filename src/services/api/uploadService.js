const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let uploadSessions = []

const uploadService = {
  async startSession(files) {
    await delay(200)
    const session = {
      id: Date.now().toString(),
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      uploadedCount: 0,
      failedCount: 0,
      startTime: new Date().toISOString(),
      status: 'active'
    }
    uploadSessions.push(session)
    return { ...session }
  },

  async updateSession(id, updateData) {
    await delay(100)
    const index = uploadSessions.findIndex(s => s.id === id)
    if (index !== -1) {
      uploadSessions[index] = { ...uploadSessions[index], ...updateData }
      return { ...uploadSessions[index] }
    }
    throw new Error('Session not found')
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