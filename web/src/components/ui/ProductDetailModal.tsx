import Modal from './Modal'
import Button from './Button'
import type { Product } from '#/lib/types'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  return (
    <Modal open={!!product} onClose={onClose} title={product?.name} maxWidthClass="max-w-lg">
      {product && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative h-40 w-full sm:w-40 shrink-0">
            <img src={product.imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-contain rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">{product.description}</p>
            <div className="text-accent-blue font-bold text-lg">SRD {product.price}</div>
            <Button
              variant="primary"
              className="mt-2 w-fit"
              onClick={() => {
                onAddToCart(product)
                onClose()
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
