import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen relative">
      <div className='min-w-full fixed top-0 z-50 px-4 py-2'>
        <Navbar />
      </div>
      <main className="flex-grow pt-32">
        {children}
      </main>
      <Footer />
    </div>
  );
}
