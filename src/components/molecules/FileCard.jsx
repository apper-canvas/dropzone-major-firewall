import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/atoms/ProgressBar'
import Badge from '@/components/atoms/Badge'

const FileCard = ({ file, onRemove, onRetry }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type.includes('pdf')) return 'FileText'
    if (type.includes('zip') || type.includes('rar')) return 'Archive'
    if (type.startsWith('video/')) return 'Video'
    if (type.startsWith('audio/')) return 'Music'
    return 'File'
  }
  
  const getStatusBadge = () => {
    switch (file.status) {
      case 'completed':
        return <Badge variant="success" icon="CheckCircle">Completed</Badge>
      case 'uploading':
        return <Badge variant="info" icon="Upload">Uploading</Badge>
      case 'failed':
        return <Badge variant="error" icon="AlertCircle">Failed</Badge>
      case 'pending':
        return <Badge variant="default" icon="Clock">Pending</Badge>
      default:
        return <Badge variant="default">Unknown</Badge>
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-surface/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4 hover:border-primary/50 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-12 h-12 object-cover rounded-lg border border-gray-600"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <ApperIcon name={getFileIcon(file.type)} className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-white truncate">{file.name}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{file.type}</span>
          </div>
          
          {/* Progress Bar */}
          {file.status === 'uploading' && (
            <ProgressBar
              progress={file.progress}
              variant="primary"
              size="sm"
              showLabel={false}
            />
          )}
          
          {file.status === 'completed' && (
            <ProgressBar
              progress={100}
              variant="success"
              size="sm"
              showLabel={false}
            />
          )}
          
          {file.status === 'failed' && (
            <ProgressBar
              progress={file.progress}
              variant="error"
              size="sm"
              showLabel={false}
            />
          )}
        </div>
        
        {/* Actions */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {file.status === 'failed' && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              icon="RotateCcw"
              onClick={() => onRetry(file.id)}
            />
          )}
          
          {(file.status === 'pending' || file.status === 'failed') && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={() => onRemove(file.id)}
              className="text-gray-400 hover:text-error"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard