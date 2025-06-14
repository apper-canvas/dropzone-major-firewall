import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import DropZone from '@/components/molecules/DropZone'
import FileCard from '@/components/molecules/FileCard'
import FileTypeFilter from '@/components/molecules/FileTypeFilter'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/atoms/ProgressBar'
import ApperIcon from '@/components/ApperIcon'
import { fileService, uploadService } from '@/services'

const FileUploader = () => {
  const [files, setFiles] = useState([])
  const [acceptedTypes, setAcceptedTypes] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadSession, setUploadSession] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const maxFileSize = 50 * 1024 * 1024 // 50MB
  
  useEffect(() => {
    loadAcceptedTypes()
  }, [])
  
  const loadAcceptedTypes = async () => {
    try {
      const types = await uploadService.getAcceptedTypes()
      const allTypes = Object.values(types).flat()
      setAcceptedTypes(allTypes)
    } catch (error) {
      console.error('Failed to load accepted types:', error)
      toast.error('Failed to load file type restrictions')
    }
  }
  
  const handleFilesSelected = async (selectedFiles) => {
    setLoading(true)
    try {
      const newFiles = []
      
      for (const file of selectedFiles) {
        // Generate preview for images
        let preview = null
        if (file.type.startsWith('image/')) {
          preview = await generateImagePreview(file)
        }
        
        const fileItem = await fileService.create({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          preview: preview
        })
        
        newFiles.push(fileItem)
      }
      
      setFiles(prev => [...prev, ...newFiles])
      toast.success(`Added ${newFiles.length} file${newFiles.length > 1 ? 's' : ''} to queue`)
    } catch (error) {
      console.error('Failed to add files:', error)
      toast.error('Failed to add files to queue')
    } finally {
      setLoading(false)
    }
  }
  
  const generateImagePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })
  }
  
  const handleRemoveFile = async (fileId) => {
    try {
      await fileService.delete(fileId)
      setFiles(prev => prev.filter(f => f.id !== fileId))
      toast.success('File removed from queue')
    } catch (error) {
      console.error('Failed to remove file:', error)
      toast.error('Failed to remove file')
    }
  }
  
  const handleRetryFile = async (fileId) => {
    try {
      await fileService.update(fileId, { status: 'pending', progress: 0 })
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'pending', progress: 0 } : f
      ))
      toast.info('File added back to upload queue')
    } catch (error) {
      console.error('Failed to retry file:', error)
      toast.error('Failed to retry file upload')
    }
  }
  
  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) {
      toast.info('No files to upload')
      return
    }
    
    setUploading(true)
    
    try {
      // Start upload session
      const session = await uploadService.startSession(pendingFiles)
      setUploadSession(session)
      
      // Upload each file
      for (const file of pendingFiles) {
        try {
          // Update file status to uploading
          await fileService.update(file.id, { status: 'uploading', progress: 0 })
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
          ))
          
          // Simulate upload with progress
          await uploadService.simulateUpload(file.id, (progress) => {
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, progress } : f
            ))
          })
          
          // Mark as completed
          await fileService.update(file.id, { 
            status: 'completed', 
            progress: 100,
            uploadedAt: new Date().toISOString()
          })
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'completed', progress: 100, uploadedAt: new Date().toISOString() } : f
          ))
          
          // Update session
          await uploadService.updateSession(session.id, {
            uploadedCount: session.uploadedCount + 1
          })
          
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          
          // Mark as failed
          await fileService.update(file.id, { status: 'failed' })
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'failed' } : f
          ))
          
          // Update session
          await uploadService.updateSession(session.id, {
            failedCount: session.failedCount + 1
          })
          
          toast.error(`Failed to upload ${file.name}`)
        }
      }
      
      const completedCount = files.filter(f => f.status === 'completed').length
      const failedCount = files.filter(f => f.status === 'failed').length
      
      if (failedCount === 0) {
        toast.success(`Successfully uploaded ${completedCount} file${completedCount > 1 ? 's' : ''}`)
      } else {
        toast.warning(`Uploaded ${completedCount} files, ${failedCount} failed`)
      }
      
    } catch (error) {
      console.error('Upload session failed:', error)
      toast.error('Upload session failed')
    } finally {
      setUploading(false)
    }
  }
  
  const handleClearAll = async () => {
    try {
      await fileService.clear()
      setFiles([])
      setUploadSession(null)
      toast.success('All files cleared')
    } catch (error) {
      console.error('Failed to clear files:', error)
      toast.error('Failed to clear files')
    }
  }
  
  const getTotalSize = () => {
    return files.reduce((sum, file) => sum + file.size, 0)
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getUploadStats = () => {
    const total = files.length
    const completed = files.filter(f => f.status === 'completed').length
    const failed = files.filter(f => f.status === 'failed').length
    const pending = files.filter(f => f.status === 'pending').length
    const uploading = files.filter(f => f.status === 'uploading').length
    
    return { total, completed, failed, pending, uploading }
  }
  
  const stats = getUploadStats()
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4"
        >
          DropZone Pro
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          Professional file uploader with drag-and-drop support
        </motion.p>
      </div>
      
      {/* Upload Stats */}
      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/30 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.pending + stats.uploading}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error">{stats.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Total Size: {formatFileSize(getTotalSize())}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                icon="Trash2"
                onClick={handleClearAll}
                disabled={uploading}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon="Upload"
                onClick={handleUploadAll}
                loading={uploading}
                disabled={stats.pending === 0}
              >
                Upload All ({stats.pending})
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DropZone
          onFilesSelected={handleFilesSelected}
          acceptedTypes={acceptedTypes}
          maxFileSize={maxFileSize}
        />
      </motion.div>
      
      {/* File Type Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FileTypeFilter acceptedTypes={acceptedTypes} />
      </motion.div>
      
      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white flex items-center">
              <ApperIcon name="Files" className="w-5 h-5 mr-2" />
              File Queue ({files.length})
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FileCard
                      file={file}
                      onRemove={handleRemoveFile}
                      onRetry={handleRetryFile}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Empty State */}
      {files.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <ApperIcon name="CloudUpload" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No files selected</h3>
          <p className="text-gray-500">
            Drag and drop files above or click to browse
          </p>
        </motion.div>
      )}
      
      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <ApperIcon name="Loader2" className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Processing files...</p>
        </motion.div>
      )}
    </div>
  )
}

export default FileUploader