"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  url: string; 
}

// Parse duration string to seconds (moved outside component for stable reference)
function parseDuration(duration: string): number {
  const [mins, secs] = duration.split(":").map(Number)
  return mins * 60 + secs
}

const TRACKS: Track[] = [
  { id: 1, code: "M01", title: "序章", duration: "4:40", isLiked: false, url: "/Alice-music/序章.mp3" },
  { id: 2, code: "M02", title: "猫的诗（咖啡店）", duration: "3:00", isLiked: false, url: "/Alice-music/猫的诗（咖啡店）.mp3" },
  { id: 3, code: "M03", title: "跳下兔子洞", duration: "3:18", isLiked: false, url: "/Alice-music/跳下兔子洞.mp3" },
  { id: 4, code: "M04", title: "小心地滑", duration: "4:07", isLiked: false, url: "/Alice-music/小心地滑.mp3" },
  { id: 5, code: "M05", title: "红玫瑰", duration: "2:56", isLiked: false, url: "/Alice-music/红玫瑰.mp3" },
  { id: 6, code: "M06", title: "千万别（Variant1）", duration: "3:42", isLiked: false, url: "/Alice-music/千万别（Variant1）.mp3" },
  { id: 7, code: "M07", title: "千万别（Variant2）", duration: "4:21", isLiked: false, url: "/Alice-music/千万别（Variant2）.mp3" },
  { id: 8, code: "M08", title: "审判（Variant）", duration: "3:33", isLiked: false, url: "/Alice-music/审判（Variant）.mp3" },
  { id: 9, code: "M09", title: "牡蛎之歌", duration: "2:48", isLiked: false, url: "/Alice-music/牡蛎之歌.mp3" },
  { id: 10, code: "M10", title: "人生是槌球", duration: "3:59", isLiked: false, url: "/Alice-music/人生是槌球.mp3" },
  { id: 11, code: "M11", title: "猫的诗（拖地）", duration: "4:15", isLiked: false, url: "/Alice-music/猫的诗（拖地）.mp3" },
  { id: 12, code: "M12", title: "茶话会", duration: "3:27", isLiked: false, url: "/Alice-music/茶话会.mp3" },
  { id: 13, code: "M13", title: "猫的诗（海边）", duration: "2:51", isLiked: false , url: "/Alice-music/猫的诗（海边）.mp3"},
  { id: 14, code: "M14", title: "反义词", duration: "3:38", isLiked: false , url: "/Alice-music/反义词.mp3"},
  { id: 15, code: "M15", title: "人生是槌球（Reprise）", duration: "4:03", isLiked: false , url: "/Alice-music/人生是槌球（Reprise）.mp3"},
  { id: 16, code: "M16", title: "长大", duration: "3:22", isLiked: false , url: "/Alice-music/千万别.mp3"},
  { id: 17, code: "M17", title: "猫的诗（森林）", duration: "4:47", isLiked: false , url: "/Alice-music/千万别.mp3"},
  { id: 18, code: "M18", title: "去何方", duration: "3:14", isLiked: false , url: "/Alice-music/去何方.mp3"},
  { id: 19, code: "M19", title: "千万别", duration: "2:59", isLiked: false , url: "/Alice-music/千万别.mp3"},
  { id: 20, code: "M20", title: "审判", duration: "3:41", isLiked: false , url: "/Alice-music/审判.mp3"},
  { id: 21, code: "M21", title: "这不对", duration: "4:28", isLiked: false, url: "/Alice-music/这不对.mp3" },
  { id: 22, code: "M22", title: "红玫瑰（Reprise）", duration: "3:06", isLiked: false, url: "/Alice-music/红玫瑰（Variant）.mp3" },
  { id: 23, code: "M23", title: "告别", duration: "3:52", isLiked: false, url: "/Alice-music/告别.mp3" },
  { id: 24, code: "M24", title: "尾声 Finale", duration: "3:52", isLiked: false , url: "/Alice-music/尾声.mp3"},
  { id: 25, code: "M25", title: "返场", duration: "3:52", isLiked: false, url: "/Alice-music/返场.mp3" },
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
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      // 这一步是把播放器真实的当前时间同步给你的 currentTime 状态
      setCurrentTime(audioRef.current.currentTime)
    }
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
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      // 真实播放：这不会导致页面跳转
      audio.play().catch((err) => {
        console.warn("播放被拦截，请先点击页面任意位置", err)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

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
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate} // 绑定时间更新
        onEnded={playNext}            // 播完自动下一首
        loop={isLooping}              // 是否循环
      />
    </div>
  )
}
