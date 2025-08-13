import { createContext, useContext, useMemo, useState } from 'react';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [holdings, setHoldings] = useState([
    { symbol: 'DEWA', price: 2.38, change: 0.45 },
    { symbol: 'SALIK', price: 2.99, change: -0.31 },
  ]);

  const addHolding = (h) => setHoldings(prev => [...prev, h]);
  const removeHolding = (idx) => setHoldings(prev => prev.filter((_, i) => i !== idx));

  const value = useMemo(() => ({ holdings, addHolding, removeHolding }), [holdings]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
}
