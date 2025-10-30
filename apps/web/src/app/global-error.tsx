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
        <div style={{ padding: '20px' }}>
          <h2>Something went wrong!</h2>
          <p>{error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}
