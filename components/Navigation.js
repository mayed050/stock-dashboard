import Link from 'next/link';
import { usePortfolio } from '../context/PortfolioContext';
import Notifications from './Notifications';

export default function Navigation() {
  const { portfolio } = usePortfolio();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              لوحة متابعة الأسهم
            </Link>
            <Link href="/portfolio" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>المحفظة</span>
              {portfolio.length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {portfolio.length}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center">
            <Notifications />
          </div>
        </div>
      </div>
    </nav>
  );
}
