import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'G&M Imports | Fragrâncias importadas',
  description: 'Boutique digital de body splashes, perfumes e autocuidado importado.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
