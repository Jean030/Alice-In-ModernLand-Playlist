"use client"

import { Play, Pause, SkipBack, SkipForward, X, Repeat, Repeat1, Heart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Track } from "@/app/page"

interface FullscreenPlayerProps {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  currentTime: number
  isLooping: boolean
  coverImage: string | null
  onClose: () => void
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onToggleLoop: () => void
  onToggleLike: (trackId: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function FullscreenPlayer({
  currentTrack,
  isPlaying,
  progress,
  currentTime,
  isLooping,
  coverImage,
  onClose,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onToggleLoop,
  onToggleLike,
}: FullscreenPlayerProps) {
  if (!currentTrack) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Background Image with Blur */}
      {coverImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 safe-area-inset-top">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Playing from
            </p>
            <p className="text-sm font-medium text-foreground">
              Alice in Modernland OST
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-4">
          <div className="relative aspect-square w-full max-w-[320px]">
            {/* Shadow */}
            <div className="absolute inset-4 bg-primary/20 blur-2xl" />
            {/* Cover */}
            <div 
              className={cn(
                "relative flex h-full w-full items-center justify-center border-2 border-primary/30 bg-card",
                isPlaying && "shadow-[0_0_60px_rgba(0,47,167,0.3)]"
              )}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={currentTrack.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <span className="font-mono text-4xl font-bold text-primary">
                    {currentTrack.code}
                  </span>
                  <div className="h-px w-16 bg-primary/30" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Alice in Modernland
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="px-8 py-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 text-right">
              <button
                onClick={() => onToggleLike(currentTrack.id)}
                className="inline-flex h-10 w-10 items-center justify-center transition-transform hover:scale-110"
              >
                <Heart
                  className={cn(
                    "h-6 w-6 transition-all",
                    currentTrack.isLiked
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            </div>
            <div className="flex-[2] min-w-0">
              <h2 className="truncate font-serif text-2xl font-bold text-foreground">
                {currentTrack.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentTrack.code}
              </p>
            </div>
            <div className="flex-1" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 px-8 py-6 pb-8 safe-area-inset-bottom">
          <button
            onClick={onToggleLoop}
            className={cn(
              "flex h-10 w-10 items-center justify-center transition-colors",
              isLooping ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isLooping ? (
              <Repeat1 className="h-5 w-5" />
            ) : (
              <Repeat className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={onPrevious}
            className="flex h-12 w-12 items-center justify-center text-foreground transition-transform hover:scale-110"
          >
            <SkipBack className="h-7 w-7 fill-current" />
          </button>

          <button
            onClick={onTogglePlayPause}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 translate-x-0.5 fill-current" />
            )}
          </button>

          <button
            onClick={onNext}
            className="flex h-12 w-12 items-center justify-center text-foreground transition-transform hover:scale-110"
          >
            <SkipForward className="h-7 w-7 fill-current" />
          </button>

          <div className="h-10 w-10" /> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  )
}
