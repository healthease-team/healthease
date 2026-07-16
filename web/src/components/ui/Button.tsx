import { Link } from '@tanstack/react-router'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-accent-blue text-white dark:text-slate-900 border-2 border-accent-blue hover:bg-brand-navy hover:border-brand-navy',
  secondary: 'bg-brand-navy text-white dark:text-slate-900 border-2 border-brand-navy hover:bg-accent-blue hover:border-accent-blue',
  outline: 'bg-surface text-brand-navy border-2 border-brand-navy hover:bg-mint-light',
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

interface CommonProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: undefined
  }

interface ButtonAsLink extends CommonProps {
  href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export default function Button(props: ButtonProps) {
  const { variant = 'primary', className = '', children } = props
  const classes = `${baseClass} ${VARIANT_CLASSES[variant]} ${className}`

  if ('href' in props && props.href) {
    const { href } = props
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    )
  }

  const { variant: _variant, className: _className, children: _children, ...buttonProps } = props as ButtonAsButton
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
