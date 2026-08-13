export function Button({ children, variant = 'primary', disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center min-h-10 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-110',
    secondary: 'bg-surface-2 text-secondary-foreground hover:bg-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
    ghost: 'text-muted-foreground hover:bg-accent',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
