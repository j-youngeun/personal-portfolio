import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useState } from 'react'

type MobileMenuItem = {
  label: string
  hash: `#${string}`
}

type HamburgerMenuProps = {
  items: MobileMenuItem[]
  onNavigate: (hash: `#${string}`) => void
}

export default function HamburgerMenu({ items, onNavigate }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.body.classList.add('mobile-menu-is-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('mobile-menu-is-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleNavigate = (hash: `#${string}`) => {
    onNavigate(hash)
    setIsOpen(false)
  }

  return (
    <div className="mobile-menu">
      <button
        className={`mobile-menu__button${isOpen ? ' is-open' : ''}`}
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="mobile-menu__dot" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              className="mobile-menu__backdrop"
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            <motion.nav
              id={menuId}
              className="mobile-menu__panel"
              aria-label="Mobile navigation"
              aria-labelledby={`${menuId}-title`}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 id={`${menuId}-title`} className="mobile-menu__title">
                Navigation
              </h2>
              {items.map((item, index) => (
                <motion.button
                  key={item.hash}
                  className={`mobile-menu__link${item.hash === '#contact' ? ' mobile-menu__link--contact' : ''}`}
                  type="button"
                  onClick={() => handleNavigate(item.hash)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + index * 0.025, duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
