import { Metadata } from 'next';

const defaultTitle = 'Zyntax - JSON to TypeScript Converter';
const defaultDescription = 'Convert JSON to TypeScript interface/type definitions with ease';

export const defaultMetadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | Zyntax`,
  },
  description: defaultDescription,
  keywords: [
    'JSON',
    'TypeScript',
    'Converter',
    'Interface',
    'Type',
    'Generator',
    'Code',
    'Developer Tools'
  ],
  authors: [{ name: 'Zyntax Team' }],
  creator: 'Zyntax Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zyntax.app',
    title: defaultTitle,
    description: defaultDescription,
    siteName: 'Zyntax',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
};