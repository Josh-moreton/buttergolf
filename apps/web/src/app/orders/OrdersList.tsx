'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type OrderStatus = 'PAYMENT_CONFIRMED' | 'LABEL_GENERATED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
type ShipmentStatus = 'PENDING' | 'PRE_TRANSIT' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURNED' | 'FAILED' | 'CANCELLED'

interface Order {
  id: string
  createdAt: Date
  status: OrderStatus
  shipmentStatus: ShipmentStatus
  amountTotal: number
  trackingCode: string | null
  trackingUrl: string | null
  labelUrl: string | null
  carrier: string | null
  service: string | null
  userRole: 'buyer' | 'seller'
  product: {
    id: string
    title: string
    images: Array<{ url: string }>
  }
  seller: {
    name: string | null
    email: string
  }
  buyer: {
    name: string | null
    email: string
  }
}

interface OrdersListProps {
  orders: Order[]
  userId: string
}

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  PENDING: 'bg-gray-200 text-gray-700',
  PRE_TRANSIT: 'bg-blue-100 text-blue-700',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  RETURNED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING: 'Pending',
  PRE_TRANSIT: 'Label Created',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
}

export function OrdersList({ orders, userId }: OrdersListProps) {
  const [filter, setFilter] = useState<'all' | 'buyer' | 'seller'>('all')

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.userRole === filter
  })

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium ${
            filter === 'all'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilter('buyer')}
          className={`px-4 py-2 font-medium ${
            filter === 'buyer'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Purchases ({orders.filter(o => o.userRole === 'buyer').length})
        </button>
        <button
          onClick={() => setFilter('seller')}
          className={`px-4 py-2 font-medium ${
            filter === 'seller'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Sales ({orders.filter(o => o.userRole === 'seller').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {order.product.images[0] ? (
                    <Image
                      src={order.product.images[0].url}
                      alt={order.product.title}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {order.product.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.userRole === 'buyer'
                          ? `Sold by ${order.seller.name || order.seller.email}`
                          : `Purchased by ${order.buyer.name || order.buyer.email}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Order #{order.id.slice(0, 8)} •{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${order.amountTotal.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          STATUS_COLORS[order.shipmentStatus]
                        }`}
                      >
                        {STATUS_LABELS[order.shipmentStatus]}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-4 space-y-2">
                    {order.carrier && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Carrier:</span>{' '}
                        {order.carrier} {order.service && `(${order.service})`}
                      </p>
                    )}
                    {order.trackingCode && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tracking:</span>{' '}
                        {order.trackingUrl ? (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {order.trackingCode}
                          </a>
                        ) : (
                          order.trackingCode
                        )}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      View Details
                    </Link>
                    {order.userRole === 'seller' && order.labelUrl && (
                      <a
                        href={order.labelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Download Label
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
