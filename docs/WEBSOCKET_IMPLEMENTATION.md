# WebSocket Server Implementation for Real-Time Offers

## Overview
This document outlines the WebSocket implementation for real-time offer updates in the ButterGolf marketplace.

## Architecture

### Server Setup (Custom Server with Socket.IO)

Next.js 13+ App Router doesn't natively support custom servers easily, so we'll use API routes with long polling initially, then upgrade to WebSocket via a separate Node server if needed.

**Alternative: Use Polling for Now**

For MVP, we'll implement polling in the client (every 5 seconds when viewing an offer) and upgrade to WebSocket later. This is simpler and works well for the initial launch.

## Client Implementation

### Hook: useOfferUpdates

```typescript
// apps/web/src/hooks/useOfferUpdates.ts
import { useEffect, useState } from 'react';

interface UseOfferUpdatesOptions {
  offerId: string;
  enabled?: boolean;
  interval?: number; // milliseconds
}

export function useOfferUpdates({
  offerId,
  enabled = true,
  interval = 5000, // 5 seconds
}: UseOfferUpdatesOptions) {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout;

    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/offers/${offerId}`);
        if (!res.ok) throw new Error('Failed to fetch offer');
        const data = await res.json();
        setOffer(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOffer();

    // Poll for updates
    const poll = () => {
      timeoutId = setTimeout(async () => {
        await fetchOffer();
        poll(); // Schedule next poll
      }, interval);
    };

    poll();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [offerId, enabled, interval]);

  return { offer, loading, error, refetch: () => fetchOffer() };
}
```

## Future WebSocket Upgrade Path

When ready to implement WebSocket (for better performance with many users):

1. Create standalone Node.js WebSocket server (separate port)
2. Use Socket.IO for cross-platform compatibility
3. Add Redis for pub/sub if scaling to multiple server instances
4. Keep HTTP polling as fallback

## Broadcasting Updates

When API routes update offers, they can trigger broadcasts:

```typescript
// Pseudo-code for future WebSocket implementation
if (process.env.WEBSOCKET_ENABLED === 'true') {
  await broadcastOfferUpdate(offerId, updatedOffer);
}
```

For now, clients will simply poll for updates.
