import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { CartItem } from '../lib/supabase';

interface CartProps {
  items: (CartItem & { games: any })[];
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onClose, onRemoveItem, onUpdateQuantity, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => {
    return sum + (item.games?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden border border-blue-500/20 max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>

        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
              <p className="text-slate-400 text-sm">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-2">Add some games to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.games?.image_url}
                      alt={item.games?.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{item.games?.title}</h3>
                      <p className="text-slate-400 text-sm">{item.games?.genre}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">${((item.games?.price || 0) * item.quantity).toFixed(2)}</div>
                      <div className="text-slate-500 text-xs">${item.games?.price} each</div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-700 p-6 bg-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-6 text-xl">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
