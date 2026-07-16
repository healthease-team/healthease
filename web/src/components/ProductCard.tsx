import Button from './ui/Button'

interface ProductCardProps {
  name: string
  image: string
  price?: number
  categoryName?: string
  onAddToCart?: () => void
  onViewDetails?: () => void
}

export default function ProductCard({ name, image, price, categoryName, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div className="bg-surface rounded-2xl shadow-card border border-brand-navy/5 p-4 hover:shadow-card-hover hover:-translate-y-1 transition-all">
      <div
        className={`relative h-32 w-full mb-3 ${onViewDetails ? 'cursor-pointer' : ''}`}
        onClick={onViewDetails}
      >
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-contain rounded-xl"
        />
      </div>
      {categoryName && <div className="text-xs text-text-muted-2 mb-1">{categoryName}</div>}
      <div className="text-brand-navy font-semibold text-sm md:text-base">
        {name}
      </div>
      {price !== undefined && (
        <div className="text-accent-blue font-bold text-sm md:text-base mt-1">SRD {price}</div>
      )}
      {(onAddToCart || onViewDetails) && (
        <div className="flex gap-2 mt-3">
          {onViewDetails && (
            <Button variant="outline" className="!px-3 !py-1.5 text-xs flex-1" onClick={onViewDetails}>
              Details
            </Button>
          )}
          {onAddToCart && (
            <Button variant="primary" className="!px-3 !py-1.5 text-xs flex-1" onClick={onAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
