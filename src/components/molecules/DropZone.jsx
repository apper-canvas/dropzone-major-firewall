import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const DropZone = ({ onFilesSelected, acceptedTypes = [], maxFileSize = 10 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef(null)
  
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragging(false)
    }
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }
  
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }
  
  const handleFiles = (files) => {
    const validFiles = []
    const errors = []
    
    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`)
        return
      }
      
      // Check file type if restrictions exist
      if (acceptedTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
        const isAccepted = acceptedTypes.some(type => 
          type.toLowerCase() === fileExtension || 
          file.type.startsWith(type.split('/')[0])
        )
        
        if (!isAccepted) {
          errors.push(`${file.name}: File type not supported`)
          return
        }
      }
      
      validFiles.push(file)
    })
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors)
      // Could emit errors to parent component for toast notifications
    }
  }
  
  const openFileDialog = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' 
          : 'border-gray-600 hover:border-primary/50 hover:bg-surface/30'
        }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        accept={acceptedTypes.join(',')}
      />
      
      <motion.div
        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
        className="space-y-4"
      >
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center
          ${isDragging 
            ? 'bg-gradient-to-r from-primary to-secondary' 
            : 'bg-gradient-to-r from-gray-700 to-gray-600'
          }`}
        >
          <ApperIcon 
            name={isDragging ? "Download" : "Upload"} 
            className="w-8 h-8 text-white" 
          />
        </div>
        
        <div>
          <h3 className="text-xl font-medium text-white mb-2">
            {isDragging ? "Drop your files here" : "Drag & drop files here"}
          </h3>
          <p className="text-gray-400 mb-4">
            or click to browse from your computer
          </p>
          
          {acceptedTypes.length > 0 && (
            <div className="text-sm text-gray-500">
              Supported formats: {acceptedTypes.join(', ')}
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            Maximum file size: {Math.round(maxFileSize / 1024 / 1024)}MB
          </div>
        </div>
      </motion.div>
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
        animate={isDragging ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default DropZone