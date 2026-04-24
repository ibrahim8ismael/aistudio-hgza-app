import type {Metadata} from 'next';
import { Lexend, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Stadium Elite',
  description: 'Fantasy Football App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${lexend.variable} ${jakarta.variable} dark`}>
      <body suppressHydrationWarning className="bg-background text-on-background min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
