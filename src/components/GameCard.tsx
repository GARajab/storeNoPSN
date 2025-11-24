import { ShoppingCart, Star } from 'lucide-react';
import { Game } from '../lib/supabase';

interface GameCardProps {
  game: Game;
  onAddToCart: (game: Game) => void;
  onGameClick: (game: Game) => void;
}

export default function GameCard({ game, onAddToCart, onGameClick }: GameCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
      <div className="relative overflow-hidden aspect-[16/9]" onClick={() => onGameClick(game)}>
        <img
          src={game.image_url}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60"></div>
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-semibold">{game.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">{game.genre}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors" onClick={() => onGameClick(game)}>
          {game.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {game.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              ${game.price}
            </div>
            <div className="text-xs text-slate-500">{game.publisher}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(game);
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
