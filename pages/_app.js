import '@/styles/globals.css';
import { PortfolioProvider } from '@/context/PortfolioContext';
import Navigation from '@/components/Navigation';

export default function MyApp({ Component, pageProps }) {
  return (
    <PortfolioProvider>
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Component {...pageProps} />
      </main>
    </PortfolioProvider>
  );
}
