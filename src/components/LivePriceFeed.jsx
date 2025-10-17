import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LivePriceFeed() {
  const [price, setPrice] = useState(0.0245);
  const [priceChange, setPriceChange] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    const initialHistory = Array.from({ length: 20 }, (_, i) => ({
      price: 0.0245 + (Math.random() - 0.5) * 0.001,
      time: Date.now() - (20 - i) * 3000
    }));
    setPriceHistory(initialHistory);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prevPrice) => {
        const change = (Math.random() - 0.48) * 0.0003;
        const newPrice = Math.max(0.02, prevPrice + change);
        const percentChange = ((newPrice - prevPrice) / prevPrice) * 100;

        setPriceChange(percentChange);
        setIsIncreasing(change >= 0);

        setPriceHistory(prev => {
          const newHistory = [...prev, { price: newPrice, time: Date.now() }];
          return newHistory.slice(-20);
        });

        return parseFloat(newPrice.toFixed(6));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderMiniChart = () => {
    if (priceHistory.length < 2) return null;

    const prices = priceHistory.map(h => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 0.0001;

    const points = priceHistory.map((item, index) => {
      const x = (index / (priceHistory.length - 1)) * 100;
      const y = 100 - ((item.price - minPrice) / priceRange) * 100;
      return `${x},${y}`;
    }).join(' ');

    const pathD = `M ${points.split(' ').map((p, i) => {
      const [x, y] = p.split(',');
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ')}`;

    return (
      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cyan-400/70">Price Chart (60s)</span>
        </div>
        <svg
          viewBox="0 0 100 30"
          className="w-full h-16"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L 100 100 L 0 100 Z`}
            fill="url(#priceGradient)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="rgb(34 211 238)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="cyber-glass rounded-2xl p-4 sm:p-6 border border-cyan-500/30 relative overflow-hidden hover-glow-cyan">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-cyan-300 uppercase tracking-wide">
          Live Price Feed
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-neon-green" />
          <span className="text-xs text-cyan-400">LIVE</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-cyan-300">
              ${price.toFixed(6)}
            </span>
            <span className="text-sm text-cyan-400/70">RAMA/USD</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isIncreasing
                ? 'bg-neon-green/20 border border-neon-green/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              {isIncreasing ? (
                <TrendingUp size={14} className="text-neon-green" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
              <span className={`text-xs font-medium ${
                isIncreasing ? 'text-neon-green' : 'text-red-400'
              }`}>
                {isIncreasing ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
            <span className="text-xs text-cyan-400/70">Last 3s</span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-cyan-400/70">24h High</p>
            <p className="text-sm font-semibold text-neon-green">${(price * 1.05).toFixed(6)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-cyan-400/70">24h Low</p>
            <p className="text-sm font-semibold text-red-400">${(price * 0.95).toFixed(6)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:hidden gap-3 mt-4 pt-4 border-t border-cyan-500/20">
        <div>
          <p className="text-xs text-cyan-400/70 mb-1">24h High</p>
          <p className="text-sm font-semibold text-neon-green">${(price * 1.05).toFixed(6)}</p>
        </div>
        <div>
          <p className="text-xs text-cyan-400/70 mb-1">24h Low</p>
          <p className="text-sm font-semibold text-red-400">${(price * 0.95).toFixed(6)}</p>
        </div>
      </div>

      {renderMiniChart()}
    </div>
  );
}
