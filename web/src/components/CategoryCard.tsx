import { useNavigate } from '@tanstack/react-router'

interface CategoryCardProps {
  name: string
  image: string
  slug: string
  size?: 'sm' | 'lg'
  to?: string
  search?: Record<string, string>
}

export default function CategoryCard({ name, image, slug, size = 'sm', to, search }: CategoryCardProps) {
  const navigate = useNavigate()
  const targetTo = to ?? '/shop'
  const targetSearch = search ?? (to ? undefined : { category: slug })

  function goToTarget() {
    navigate({ to: targetTo, search: targetSearch })
  }

  if (size === 'lg') {
    return (
      <div
        className="bg-surface rounded-3xl shadow-card border border-brand-navy/5 p-6 h-[380px] flex flex-col items-center justify-center gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all cursor-pointer"
        onClick={goToTarget}
      >
        <div className="relative h-40 w-40">
          <img src={image} alt={name} className="absolute inset-0 h-full w-full object-contain" />
        </div>
        <div className="text-brand-navy font-bold text-lg text-center">{name}</div>
      </div>
    )
  }

  return (
    <div
      className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-4 hover:shadow-card-hover hover:-translate-y-1 transition-all cursor-pointer"
      onClick={goToTarget}
    >
      <div className="relative h-32 w-full mb-3">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-contain rounded-xl"
        />
      </div>
      <div className="text-brand-navy font-semibold text-sm md:text-base">
        {name}
      </div>
    </div>
  )
}
