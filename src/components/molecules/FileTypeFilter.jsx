import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FileTypeFilter = ({ acceptedTypes, className = '' }) => {
  const typeCategories = {
    images: {
      label: 'Images',
      icon: 'Image',
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    },
    documents: {
      label: 'Documents',
      icon: 'FileText', 
      extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf']
    },
    archives: {
      label: 'Archives',
      icon: 'Archive',
      extensions: ['.zip', '.rar', '.7z', '.tar.gz']
    },
    videos: {
      label: 'Videos',
      icon: 'Video',
      extensions: ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    audio: {
      label: 'Audio',
      icon: 'Music',
      extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg']
    }
  }
  
  const getAcceptedCategories = () => {
    const categories = []
    
    Object.entries(typeCategories).forEach(([key, category]) => {
      const hasAcceptedType = category.extensions.some(ext => 
        acceptedTypes.includes(ext)
      )
      if (hasAcceptedType) {
        categories.push({ key, ...category })
      }
    })
    
    return categories
  }
  
  const acceptedCategories = getAcceptedCategories()
  
  if (acceptedCategories.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-gray-400 text-sm">All file types accepted</p>
      </div>
    )
  }
  
  return (
    <div className={`${className}`}>
      <h4 className="text-sm font-medium text-gray-300 mb-3">Accepted File Types</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {acceptedCategories.map((category, index) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface/30 backdrop-blur-sm border border-gray-600/50 rounded-lg p-3 text-center hover:border-primary/50 transition-all duration-200"
          >
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <ApperIcon name={category.icon} className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xs font-medium text-gray-300 mb-1">
              {category.label}
            </div>
            <div className="text-xs text-gray-500">
              {category.extensions.slice(0, 2).join(', ')}
              {category.extensions.length > 2 && '...'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FileTypeFilter