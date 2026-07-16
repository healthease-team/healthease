import { useTheme } from '#/lib/theme-context'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-9 h-9 rounded-full flex items-center justify-center text-brand-navy hover:bg-mint-light transition-colors ${className}`}
    >
      <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} text-lg`} />
    </button>
  )
}
