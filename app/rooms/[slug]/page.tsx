
import React from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RoomDetail } from '@/components/room-detail'
// Removed direct import from lib/data
// import { rooms } from '@/lib/data'

interface RoomDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getRoom(slug: string) {
  // In a real app with external API, use absolute URL or server-side logic
  // Since we are in the same Next.js app, we should call the logic directly or use fetch with absolute URL
  // For this exercise, we simulate the fetch call behavior but keep it robust
  // However, fetching own API in Server Component requires absolute URL like http://localhost:3000
  // which is flaky in diverse environments.
  // Ideally, we extract the logic from the route handler and use it here directly.
  
  // Re-importing purely for data access simulation as "fetch" replacement
  const { rooms } = await import('@/lib/data');
  const room = rooms.find((r) => r.slug === slug);
  
  if (!room) return null;

  const relatedRooms = rooms
    .filter((r) => r.type === room.type && r.id !== room.id)
    .slice(0, 3);

  return { room, relatedRooms };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params
  
  const data = await getRoom(slug);

  if (!data || !data.room) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <RoomDetail room={data.room} relatedRooms={data.relatedRooms} />
      <Footer />
    </main>
  )
}

