import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MenuItem from './MenuItem'
import { useI18n } from '../i18n'

export default function MenuSection({ section, onAdd, userCard }){
  const { t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const hasDiscount = userCard?.status === 'active'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  return (
    <motion.section 
      ref={ref}
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0 }} 
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
      >
        {t(section.title_key)}
      </motion.h2>
      <motion.div 
        className="items"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {section.items.map(item => (
          <motion.div key={item.id} variants={itemVariants}>
            <MenuItem item={item} onAdd={onAdd} hasDiscount={hasDiscount} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
