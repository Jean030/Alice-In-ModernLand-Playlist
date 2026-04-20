"use client"

import { useState, useEffect, useCallback } from "react"
import { PlaylistHeader } from "@/components/playlist-header"
import { TrackList } from "@/components/track-list"
import { NowPlaying } from "@/components/now-playing"
import { PlaybackControls } from "@/components/playback-controls"
import { FullscreenPlayer } from "@/components/fullscreen-player"

export interface Track {
  id: number
  code: string
  title: string
  duration: string
  isLiked: boolean
}

// Parse duration string to seconds (moved outside component for stable reference)
function parseDuration(duration: string): number {
  const [mins, secs] = duration.split(":").map(Number)
  return mins * 60 + secs
}

const TRACKS: Track[] = [
  { id: 1, code: "M01", title: "序章", duration: "4:32", isLiked: false },
  { id: 2, code: "M02", title: "猫的诗（咖啡）", duration: "3:45", isLiked: false },
  { id: 3, code: "M03", title: "The Queen's Gambit", duration: "3:18", isLiked: false },
  { id: 4, code: "M04", title: "Midnight Tea Party", duration: "4:07", isLiked: false },
  { id: 5, code: "M05", title: "Cheshire Shadows", duration: "2:56", isLiked: false },
  { id: 6, code: "M06", title: "Through the Looking Glass", duration: "3:42", isLiked: false },
  { id: 7, code: "M07", title: "Electric Dreams", duration: "4:21", isLiked: false },
  { id: 8, code: "M08", title: "The Red Queen's Court", duration: "3:33", isLiked: false },
  { id: 9, code: "M09", title: "Lost in Translation", duration: "2:48", isLiked: false },
  { id: 10, code: "M10", title: "Synthetic Garden", duration: "3:59", isLiked: false },
  { id: 11, code: "M11", title: "White Rabbit's Lament", duration: "4:15", isLiked: false },
  { id: 12, code: "M12", title: "Digital Heartbreak", duration: "3:27", isLiked: false },
  { id: 13, code: "M13", title: "The Caterpillar's Riddle", duration: "2:51", isLiked: false },
  { id: 14, code: "M14", title: "Clockwork Waltz", duration: "3:38", isLiked: false },
  { id: 15, code: "M15", title: "Painted Roses", duration: "4:03", isLiked: false },
  { id: 16, code: "M16", title: "Madness & Method", duration: "3:22", isLiked: false },
  { id: 17, code: "M17", title: "The Trial", duration: "4:47", isLiked: false },
  { id: 18, code: "M18", title: "Falling Deeper", duration: "3:14", isLiked: false },
  { id: 19, code: "M19", title: "Cards in the Wind", duration: "2:59", isLiked: false },
  { id: 20, code: "M20", title: "Wake Up, Alice", duration: "3:41", isLiked: false },
  { id: 21, code: "M21", title: "Modern Wonderland", duration: "4:28", isLiked: false },
  { id: 22, code: "M22", title: "Off With Their Heads", duration: "3:06", isLiked: false },
  { id: 23, code: "M23", title: "Remember Who You Are", duration: "3:52", isLiked: false },
  { id: 24, code: "M24", title: "Finale: Home Again", duration: "5:17", isLiked: false },
]

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>(() => TRACKS.map(t => ({ ...t })))
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playMode, setPlayMode] = useState<"sequence" | "shuffle" | "liked">("sequence")
  const [currentTime, setCurrentTime] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)

  // Calculate progress percentage
  const progress = currentTrack 
    ? (currentTime / parseDuration(currentTrack.duration)) * 100 
    : 0

  const getPlayableTracks = useCallback(() => {
    if (playMode === "liked") {
      return tracks.filter((t) => t.isLiked)
    }
    return tracks
  }, [tracks, playMode])

  const playTrack = (track: Track) => {
    // If clicking the same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
      return
    }
    // If clicking a different track, start playing it
    setCurrentTrack(track)
    setIsPlaying(true)
    setCurrentTime(0)
  }

  const toggleLike = (trackId: number) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === trackId ? { ...track, isLiked: !track.isLiked } : track))
    )
  }

  const playNext = useCallback(() => {
    const playable = getPlayableTracks()
    if (playable.length === 0) return

    // If looping, restart the same track
    if (isLooping && currentTrack) {
      setCurrentTime(0)
      return
    }

    if (playMode === "shuffle") {
      const randomIndex = Math.floor(Math.random() * playable.length)
      setCurrentTrack(playable[randomIndex])
    } else {
      const currentIndex = playable.findIndex((t) => t.id === currentTrack?.id)
      const nextIndex = (currentIndex + 1) % playable.length
      setCurrentTrack(playable[nextIndex])
    }
    setCurrentTime(0)
  }, [currentTrack, playMode, getPlayableTracks, isLooping])

  const playPrevious = useCallback(() => {
    const playable = getPlayableTracks()
    if (playable.length === 0) return

    const currentIndex = playable.findIndex((t) => t.id === currentTrack?.id)
    const prevIndex = currentIndex <= 0 ? playable.length - 1 : currentIndex - 1
    setCurrentTrack(playable[prevIndex])
    setCurrentTime(0)
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

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  // Handle image upload for cover
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Real-time progress tracking (1 second = 1 second)
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const trackDuration = parseDuration(currentTrack.duration)
      
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= trackDuration) {
            playNext()
            return 0
          }
          return prev + 1
        })
      }, 1000) // Update every 1 second (real time)
      
      return () => clearInterval(interval)
    }
  }, [isPlaying, currentTrack, playNext])

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreen])

  const likedCount = tracks.filter((t) => t.isLiked).length

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-30 opacity-[0.03]" 
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} 
      />
      
      <main className="relative mx-auto max-w-6xl px-3 pb-28 pt-6 sm:px-4 sm:pb-32 sm:pt-8 md:px-8">
        <PlaylistHeader 
          likedCount={likedCount} 
          totalTracks={tracks.length}
          coverImage={coverImage}
          onImageUpload={handleImageUpload}
        />
        
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
        currentTime={currentTime}
        isLooping={isLooping}
        coverImage={coverImage}
        onTogglePlayPause={togglePlayPause}
        onNext={playNext}
        onPrevious={playPrevious}
        onToggleLoop={toggleLoop}
        onOpenFullscreen={() => setIsFullscreen(true)}
      />

      {/* Fullscreen Player */}
      {isFullscreen && (
        <FullscreenPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          progress={progress}
          currentTime={currentTime}
          isLooping={isLooping}
          coverImage={coverImage}
          onClose={() => setIsFullscreen(false)}
          onTogglePlayPause={togglePlayPause}
          onNext={playNext}
          onPrevious={playPrevious}
          onToggleLoop={toggleLoop}
          onToggleLike={toggleLike}
        />
      )}
    </div>
  )
}
