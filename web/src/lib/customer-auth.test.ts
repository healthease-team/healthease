// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { getCustomerSession, signInUser } from './customer-auth'
import { addReview, getReviews } from './reviews-store'

describe('customer auth flow', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('persists a demo session for the selected role', () => {
    const session = signInUser('customer@healthease.com', 'customer123', 'customer')

    expect(session).toMatchObject({
      email: 'customer@healthease.com',
      role: 'customer',
      name: 'Denver',
    })
    expect(getCustomerSession()).toEqual(session)
  })
})

describe('review scoping', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('filters reviews by product id', () => {
    addReview({
      id: 'a',
      productId: 'product-1',
      authorName: 'Jane',
      comment: 'Great',
      rating: 5,
      createdAt: '2025-01-01T00:00:00.000Z',
    })

    addReview({
      id: 'b',
      productId: 'product-2',
      authorName: 'Sam',
      comment: 'Nice',
      rating: 4,
      createdAt: '2025-01-02T00:00:00.000Z',
    })

    expect(getReviews('product-1')).toHaveLength(1)
    expect(getReviews('product-2')).toHaveLength(1)
    expect(getReviews('product-3')).toHaveLength(0)
  })
})
