import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Wraps children in a div that fades/slides/scales into view on scroll.
 * type: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale'
 */
export default function Reveal({ type = 'fade-up', as: Tag = 'div', className = '', stagger = false, ...props }) {
  const ref = useScrollReveal()
  return (
    <Tag
      ref={ref}
      data-reveal={type}
      className={stagger ? `reveal-stagger ${className}` : className}
      {...props}
    />
  )
}
