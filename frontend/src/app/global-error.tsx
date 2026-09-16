'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Something went wrong!</h2>
          <p>{error.message}</p>
          <button 
            onClick={() => reset()}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
