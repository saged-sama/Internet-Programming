import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen relative">
      <div className='min-w-full fixed top-0 z-10'>
        <Navbar />
      </div>
      <main className="flex-grow mt-40">
        {children}
      </main>
      <Footer />
    </div>
  );
}
