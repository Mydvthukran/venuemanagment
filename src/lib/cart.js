export function addItemToCart(cart, item) {
  const existing = cart.find((c) => c.id === item.id)

  if (existing) {
    return cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
  }

  return [...cart, { ...item, qty: 1 }]
}

export function updateItemQuantity(cart, id, delta) {
  return cart
    .map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
    .filter((c) => c.qty > 0)
}

export function removeItemFromCart(cart, id) {
  return cart.filter((c) => c.id !== id)
}

export function calculateCartTotals(cart) {
  return cart.reduce(
    (acc, item) => {
      acc.total += item.price * item.qty
      acc.itemCount += item.qty
      return acc
    },
    { total: 0, itemCount: 0 },
  )
}
