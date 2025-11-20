'use client'

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#323232' }}>
            Something went wrong!
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '24px', color: '#545454' }}>
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFAD2',
              backgroundColor: '#F45314',
              border: 'none',
              borderRadius: '32px',
              padding: '14px 40px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
