import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addToPortfolio = (stock, quantity, price) => {
    const existingIndex = portfolio.findIndex(item => item.symbol === stock);
    
    if (existingIndex >= 0) {
      const existingItem = portfolio[existingIndex];
      const totalQuantity = existingItem.quantity + quantity;
      const totalValue = (existingItem.avgPrice * existingItem.quantity) + (price * quantity);
      const newAvgPrice = totalValue / totalQuantity;
      
      const newPortfolio = [...portfolio];
      newPortfolio[existingIndex] = {
        ...existingItem,
        quantity: totalQuantity,
        avgPrice: newAvgPrice,
        totalValue: totalValue
      };
      setPortfolio(newPortfolio);
    } else {
      setPortfolio([...portfolio, {
        symbol: stock,
        quantity,
        avgPrice: price,
        totalValue: price * quantity
      }]);
    }

    setTransactions([...transactions, {
      id: Date.now(),
      symbol: stock,
      type: 'شراء',
      quantity,
      price,
      total: price * quantity,
      date: new Date().toISOString()
    }]);
  };

  const sellFromPortfolio = (stock, quantity, currentPrice) => {
    const existingIndex = portfolio.findIndex(item => item.symbol === stock);
    
    if (existingIndex >= 0) {
      const existingItem = portfolio[existingIndex];
      
      if (quantity >= existingItem.quantity) {
        setPortfolio(portfolio.filter(item => item.symbol !== stock));
      } else {
        const newPortfolio = [...portfolio];
        newPortfolio[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity - quantity,
          totalValue: (existingItem.quantity - quantity) * existingItem.avgPrice
        };
        setPortfolio(newPortfolio);
      }

      setTransactions([...transactions, {
        id: Date.now(),
        symbol: stock,
        type: 'بيع',
        quantity,
        price: currentPrice,
        total: currentPrice * quantity,
        date: new Date().toISOString()
      }]);
    }
  };

  const getPortfolioValue = (currentPrices) => {
    return portfolio.reduce((total, item) => {
      const currentPrice = currentPrices[item.symbol] || 0;
      return total + (item.quantity * currentPrice);
    }, 0);
  };

  const getPortfolioReturn = (currentPrices) => {
    const currentValue = getPortfolioValue(currentPrices);
    const investedValue = portfolio.reduce((total, item) => total + item.totalValue, 0);
    return investedValue > 0 ? ((currentValue - investedValue) / investedValue) * 100 : 0;
  };

  return (
    <PortfolioContext.Provider value={{
      portfolio,
      transactions,
      addToPortfolio,
      sellFromPortfolio,
      getPortfolioValue,
      getPortfolioReturn
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
