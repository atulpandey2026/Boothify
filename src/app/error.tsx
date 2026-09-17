'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Boothify application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ maxWidth: '520px', textAlign: 'center' }}>
            <h1>Something went wrong</h1>
            <p>Please try again. If the problem continues, refresh the page.</p>
            <button
              onClick={() => reset()}
              style={{ padding: '12px 20px', border: 0, borderRadius: '8px', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
