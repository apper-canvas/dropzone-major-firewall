import { motion } from 'framer-motion'

const ProgressBar = ({ progress = 0, variant = 'primary', size = 'md', showLabel = false, label = '' }) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary',
    success: 'bg-gradient-to-r from-success to-emerald-400',
    warning: 'bg-gradient-to-r from-warning to-orange-400',
    error: 'bg-gradient-to-r from-error to-red-400'
  }
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${heights[size]}`}>
        <motion.div
          className={`${heights[size]} ${variants[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default ProgressBar