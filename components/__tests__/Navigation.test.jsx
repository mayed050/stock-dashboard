import { render, screen } from '@testing-library/react';
import Navigation from '../Navigation';
import { usePortfolio } from '../../context/PortfolioContext';

jest.mock('../../context/PortfolioContext', () => ({
  usePortfolio: jest.fn(),
}));

jest.mock('../Notifications', () => () => <div />);

describe('Navigation', () => {
  it('renders links and portfolio count', () => {
    const mockPortfolio = [{ symbol: 'AAPL' }, { symbol: 'TSLA' }];
    usePortfolio.mockReturnValue({ portfolio: mockPortfolio });

    render(<Navigation />);

    expect(screen.getByText('لوحة متابعة الأسهم')).toBeInTheDocument();
    expect(screen.getByText('المحفظة')).toBeInTheDocument();
    expect(screen.getByText(String(mockPortfolio.length))).toBeInTheDocument();
  });
});
