'use client'

import Link from 'next/link'

export function HomeScreen() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      gap: '16px'
    }}>
      <h1>ButterGolf ⛳</h1>
      <p style={{ textAlign: 'center' }}>
        Track your golf rounds with ease
      </p>
      <Link href="/rounds">
        <button
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          View Rounds
        </button>
      </Link>
    </div>
  )
}
