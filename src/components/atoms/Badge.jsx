import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ children, variant = 'default', size = 'sm', icon, className = '' }) => {
  const variants = {
    default: 'bg-gray-700 text-gray-200',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
    info: 'bg-info/20 text-info border border-info/30'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }
  
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <ApperIcon name={icon} className="w-3 h-3 mr-1" />}
      {children}
    </motion.span>
  )
}

export default Badge