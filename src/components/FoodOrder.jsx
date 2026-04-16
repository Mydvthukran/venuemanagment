import { useState } from 'react'
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowRight, Clock, MapPin } from 'lucide-react'
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  calculateCartTotals,
} from '../lib/cart'

const menuCategories = ['All', 'Burgers', 'Pizza', 'Drinks', 'Snacks', 'Desserts']

const menuItems = [
  { id: 1, name: 'Classic Smash Burger', desc: 'Double patty, cheddar, pickles', emoji: '🍔', price: 12.99, prep: '8 min', cat: 'Burgers', popular: true },
  { id: 2, name: 'Margherita Pizza', desc: 'Fresh mozzarella, basil, tomato', emoji: '🍕', price: 14.99, prep: '12 min', cat: 'Pizza' },
  { id: 3, name: 'Craft IPA Beer', desc: 'Local brew, 6.2% ABV', emoji: '🍺', price: 9.99, prep: '1 min', cat: 'Drinks', popular: true },
  { id: 4, name: 'Loaded Nachos', desc: 'Cheese, jalapeños, sour cream', emoji: '🧀', price: 10.99, prep: '5 min', cat: 'Snacks' },
  { id: 5, name: 'Hot Dog Deluxe', desc: 'All-beef frank, mustard, relish', emoji: '🌭', price: 8.99, prep: '4 min', cat: 'Snacks', popular: true },
  { id: 6, name: 'Chicken Wings', desc: 'Buffalo sauce, ranch dip', emoji: '🍗', price: 13.99, prep: '10 min', cat: 'Snacks' },
  { id: 7, name: 'Pepperoni Pizza', desc: 'Double pepperoni, mozzarella', emoji: '🍕', price: 15.99, prep: '12 min', cat: 'Pizza' },
  { id: 8, name: 'Lemonade', desc: 'Fresh-squeezed, ice-cold', emoji: '🍋', price: 5.99, prep: '1 min', cat: 'Drinks' },
  { id: 9, name: 'Soft Pretzel', desc: 'Warm, salted, cheese dip', emoji: '🥨', price: 6.99, prep: '3 min', cat: 'Snacks' },
  { id: 10, name: 'Ice Cream Sundae', desc: 'Vanilla, chocolate, sprinkles', emoji: '🍨', price: 7.99, prep: '2 min', cat: 'Desserts' },
  { id: 11, name: 'Cheeseburger Slider', desc: 'Mini burger trio', emoji: '🍔', price: 11.99, prep: '6 min', cat: 'Burgers' },
  { id: 12, name: 'Cola Float', desc: 'Ice cream + cola classic', emoji: '🥤', price: 6.99, prep: '2 min', cat: 'Drinks' },
]

export default function FoodOrder({ showToast }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])

  const filtered = menuItems
    .filter(item => category === 'All' || item.cat === category)
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))

  const addToCart = (item) => {
    setCart((prev) => addItemToCart(prev, item))
  }

  const updateQty = (id, delta) => {
    setCart((prev) => updateItemQuantity(prev, id, delta))
  }

  const removeFromCart = (id) => {
    setCart((prev) => removeItemFromCart(prev, id))
  }

  const { total, itemCount } = calculateCartTotals(cart)

  return (
    <div>
      <div className="page-header animate-fadeInUp">
        <div className="page-header-left">
          <h2>Food & Drinks</h2>
          <p>Order from your seat — delivered in minutes</p>
        </div>
      </div>

      {/* Delivery banner */}
      <div className="delivery-banner animate-fadeInUp delay-1">
        <div className="delivery-banner-icon">
          <MapPin size={22} />
        </div>
        <div className="delivery-banner-text">
          <h3>Delivering to Seat A-14, Row 7</h3>
          <p>Orders are delivered directly to your seat by venue runners</p>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }} onClick={() => showToast('Seat selection mode activated.', MapPin)}>
          Change Seat
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
        {/* Left — Menu */}
        <div style={{ flex: '1 1 500px', minWidth: 0 }}>
          {/* Category Tabs + Search */}
          <div className="flex items-center justify-between mb-4 animate-fadeInUp delay-1" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="pill-tabs" style={{ flexWrap: 'wrap' }}>
              {menuCategories.map(cat => (
                <button
                  key={cat}
                  className={`pill-tab ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search menu..."
                aria-label="Search menu items"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Food Grid */}
          <div className="food-grid animate-fadeInUp delay-2">
            {filtered.map(item => (
              <div className="food-card" key={item.id}>
                <div className="food-image">
                  {item.emoji}
                  <span className="food-prep-badge">
                    <Clock size={9} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                    {item.prep}
                  </span>
                  {item.popular && (
                    <span style={{
                      position: 'absolute', top: 8, left: 8,
                      background: 'var(--accent-amber)',
                      color: '#000', fontSize: '0.6rem', fontWeight: 700,
                      padding: '2px 7px', borderRadius: 4
                    }}>
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="food-details">
                  <div className="food-name">{item.name}</div>
                  <div className="food-desc">{item.desc}</div>
                  <div className="food-footer">
                    <div className="food-price">${item.price.toFixed(2)}</div>
                    <button
                      className="food-add-btn"
                      aria-label={`Add ${item.name} to cart`}
                      onClick={() => addToCart(item)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Cart */}
        {cart.length > 0 && (
          <div className="cart-panel animate-fadeIn" style={{ flex: '1 1 340px' }}>
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCart size={18} />
                Your Order
                <span className="badge" style={{ background: 'var(--accent-blue)', color: 'white' }}>{itemCount}</span>
              </div>
            </div>

            <div style={{ maxHeight: 340, overflowY: 'auto' }}>
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <span className="cart-item-emoji">{item.emoji}</span>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                  <div className="cart-qty-controls">
                    <button className="cart-qty-btn" aria-label={`Decrease quantity for ${item.name}`} onClick={() => updateQty(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button className="cart-qty-btn" aria-label={`Increase quantity for ${item.name}`} onClick={() => updateQty(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button aria-label={`Remove ${item.name} from cart`} onClick={() => removeFromCart(item.id)} style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', padding: 4
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">${total.toFixed(2)}</span>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: '12px 0 4px' }}>
              <Clock size={11} style={{ verticalAlign: '-1px', marginRight: 4 }} />
              Estimated delivery: 10-15 min
            </div>

            <button className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 12 }} onClick={() => {
              showToast('Order placed successfully! Delivery in ~12 mins.', ShoppingCart)
              setCart([])
            }}>
              Place Order
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
