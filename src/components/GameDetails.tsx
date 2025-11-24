import { X, ShoppingCart, Star, Calendar, Package } from 'lucide-react';
import { Game } from '../lib/supabase';

interface GameDetailsProps {
  game: Game;
  onClose: () => void;
  onAddToCart: (game: Game) => void;
}

export default function GameDetails({ game, onClose, onAddToCart }: GameDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden border border-blue-500/20 my-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white transition-colors bg-black/50 backdrop-blur-sm rounded-full p-2"
        >
          <X size={24} />
        </button>

        <div className="relative h-96 overflow-hidden">
          <img
            src={game.image_url}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-3">
                  <span className="text-white text-sm font-semibold">{game.genre}</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">{game.title}</h2>
                <div className="flex items-center space-x-4 text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{game.rating}/10</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package size={18} />
                    <span>{game.publisher}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={18} />
                    <span>{formatDate(game.release_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">About This Game</h3>
            <p className="text-slate-300 leading-relaxed">{game.description}</p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <div>
              <div className="text-sm text-slate-400 mb-1">Price</div>
              <div className="text-4xl font-bold text-white">${game.price}</div>
            </div>
            <button
              onClick={() => {
                onAddToCart(game);
                onClose();
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-3 shadow-lg shadow-blue-500/25 text-lg"
            >
              <ShoppingCart size={24} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
