const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let fileItems = []

const fileService = {
  async getAll() {
    await delay(300)
    return [...fileItems]
  },

  async getById(id) {
    await delay(200)
    const item = fileItems.find(f => f.id === id)
    return item ? { ...item } : null
  },

  async create(fileData) {
    await delay(400)
    const newFile = {
      id: Date.now().toString(),
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      status: 'pending',
      progress: 0,
      uploadedAt: null,
      preview: fileData.preview || null,
      ...fileData
    }
    fileItems.push(newFile)
    return { ...newFile }
  },

  async update(id, updateData) {
    await delay(300)
    const index = fileItems.findIndex(f => f.id === id)
    if (index !== -1) {
      fileItems[index] = { ...fileItems[index], ...updateData }
      return { ...fileItems[index] }
    }
    throw new Error('File not found')
  },

  async delete(id) {
    await delay(200)
    const index = fileItems.findIndex(f => f.id === id)
    if (index !== -1) {
      const deleted = fileItems.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('File not found')
  },

  async clear() {
    await delay(300)
    fileItems = []
    return true
  }
}

export default fileService