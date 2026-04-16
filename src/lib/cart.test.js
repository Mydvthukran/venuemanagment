import { describe, expect, it } from 'vitest'
import { addItemToCart, calculateCartTotals, removeItemFromCart, updateItemQuantity } from './cart'

const burger = { id: 1, name: 'Burger', price: 10 }

describe('cart helpers', () => {
  it('adds items and increments quantity', () => {
    const once = addItemToCart([], burger)
    const twice = addItemToCart(once, burger)
    expect(twice[0].qty).toBe(2)
  })

  it('updates and removes quantity safely', () => {
    const cart = [{ ...burger, qty: 1 }]
    expect(updateItemQuantity(cart, 1, -1)).toEqual([])
  })

  it('calculates totals accurately', () => {
    const cart = [{ ...burger, qty: 2 }]
    expect(calculateCartTotals(cart)).toEqual({ total: 20, itemCount: 2 })
  })

  it('removes specific cart item', () => {
    const cart = [{ ...burger, qty: 1 }, { id: 2, name: 'Fries', price: 5, qty: 1 }]
    const next = removeItemFromCart(cart, 1)
    expect(next).toHaveLength(1)
    expect(next[0].id).toBe(2)
  })
})
