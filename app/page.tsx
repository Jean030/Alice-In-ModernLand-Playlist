"use client"

import { useState, useEffect, useCallback } from "react"
import { PlaylistHeader } from "@/components/playlist-header"
import { TrackList } from "@/components/track-list"
import { NowPlaying } from "@/components/now-playing"
import { PlaybackControls } from "@/components/playback-controls"

export interface Track {
  id: number
  code: string
  title: string
  duration: string
  isLiked: boolean
}

const generateTracks = (): Track[] => {
  const trackTitles = [
    "Overture: Into the Rabbit Hole",
    "Neon Wonderland",
    "The Queen's Gambit",
    "Midnight Tea Party",
    "Cheshire Shadows",
    "Through the Looking Glass",
    "Electric Dreams",
    "The Red Queen's Court",
    "Lost in Translation",
    "Synthetic Garden",
    "White Rabbit's Lament",
    "Digital Heartbreak",
    "The Caterpillar's Riddle",
    "Clockwork Waltz",
    "Painted Roses",
    "Madness & Method",
    "The Trial",
    "Falling Deeper",
    "Cards in the Wind",
    "Wake Up, Alice",
    "Modern Wonderland",
    "Off With Their Heads",
    "Remember Who You Are",
    "Finale: Home Again",
  ]

  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    code: `M${String(i + 1).padStart(2, "0")}`,
    title: trackTitles[i],
    duration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    isLiked: false,
  }))
}

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>(generateTracks)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playMode, setPlayMode] = useState<"sequence" | "shuffle" | "liked">("sequence")
  const [progress, setProgress] = useState(0)

  const getPlayableTracks = useCallback(() => {
    if (playMode === "liked") {
      return tracks.filter((t) => t.isLiked)
    }
    return tracks
  }, [tracks, playMode])

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)
  }

  const toggleLike = (trackId: number) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === trackId ? { ...track, isLiked: !track.isLiked } : track))
    )
  }

  const playNext = useCallback(() => {
    const playable = getPlayableTracks()
    if (playable.length === 0) return

    if (playMode === "shuffle") {
      const randomIndex = Math.floor(Math.random() * playable.length)
      setCurrentTrack(playable[randomIndex])
    } else {
      const currentIndex = playable.findIndex((t) => t.id === currentTrack?.id)
      const nextIndex = (currentIndex + 1) % playable.length
      setCurrentTrack(playable[nextIndex])
    }
    setProgress(0)
  }, [currentTrack, playMode, getPlayableTracks])

  const playPrevious = useCallback(() => {
    const playable = getPlayableTracks()
    if (playable.length === 0) return

    const currentIndex = playable.findIndex((t) => t.id === currentTrack?.id)
    const prevIndex = currentIndex <= 0 ? playable.length - 1 : currentIndex - 1
    setCurrentTrack(playable[prevIndex])
    setProgress(0)
  }, [currentTrack, getPlayableTracks])

  const togglePlayPause = () => {
    if (!currentTrack) {
      const playable = getPlayableTracks()
      if (playable.length > 0) {
        setCurrentTrack(playable[0])
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            playNext()
            return 0
          }
          return prev + 0.5
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isPlaying, currentTrack, playNext])

  const likedCount = tracks.filter((t) => t.isLiked).length

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" 
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} 
      />
      
      <main className="relative mx-auto max-w-6xl px-4 pb-32 pt-8 md:px-8">
        <PlaylistHeader likedCount={likedCount} totalTracks={tracks.length} />
        
        <PlaybackControls
          playMode={playMode}
          setPlayMode={setPlayMode}
          likedCount={likedCount}
        />

        <TrackList
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          playMode={playMode}
          onPlayTrack={playTrack}
          onToggleLike={toggleLike}
        />
      </main>

      <NowPlaying
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
      />
    </div>
  )
}
