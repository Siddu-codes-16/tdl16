import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OMNI 3D — Spatial Smart To-Do List',
  description: 'Production-ready Next.js 3D spatial to-do task orchestrator with natural language processing and Framer Motion spring physics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#060913] selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
