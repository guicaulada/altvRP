import { AppProps } from 'next/app';
import React from 'react';

declare global {
  interface Window {
    alt: any
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
