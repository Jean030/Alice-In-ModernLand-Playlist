"use client"

import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Track } from "@/app/page"

interface NowPlayingProps {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  currentTime: number
  isLooping: boolean
  coverImage: string | null
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onToggleLoop: () => void
  onOpenFullscreen: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function NowPlaying({
  currentTrack,
  isPlaying,
  progress,
  currentTime,
  isLooping,
  coverImage,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onToggleLoop,
  onOpenFullscreen,
}: NowPlayingProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md safe-area-inset-bottom">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        {/* Album Cover - Clickable for fullscreen */}
        <button
          onClick={onOpenFullscreen}
          disabled={!currentTrack}
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border transition-all sm:h-14 sm:w-14",
            currentTrack 
              ? "border-primary/50 bg-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(0,47,167,0.3)]" 
              : "border-border bg-muted cursor-default"
          )}
        >
          {currentTrack ? (
            coverImage ? (
              <img
                src={coverImage}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-mono text-xs font-bold text-primary">
                {currentTrack.code}
              </span>
            )
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
          )}
          {/* Play indicator overlay */}
          {currentTrack && isPlaying && (
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 to-transparent pb-1">
              <div className="flex items-end gap-0.5">
                <span className="h-2 w-0.5 animate-pulse bg-white" style={{ animationDelay: "0ms" }} />
                <span className="h-3 w-0.5 animate-pulse bg-white" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-0.5 animate-pulse bg-white" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </button>

        {/* Track Info - Minimal width on mobile */}
        <button
          onClick={onOpenFullscreen}
          disabled={!currentTrack}
          className="flex min-w-0 flex-1 flex-col items-start text-left sm:flex-initial sm:w-40 md:w-52"
        >
          {currentTrack ? (
            <>
              <p className="w-full truncate text-sm font-medium text-foreground">
                {currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(currentTime)} / {currentTrack.duration}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a track to play</p>
          )}
        </button>

        {/* Playback Controls - Centered */}
        <div className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
          <button
            onClick={onPrevious}
            disabled={!currentTrack}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 sm:h-9 sm:w-9"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={onTogglePlayPause}
            className="flex h-10 w-10 items-center justify-center border border-primary bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:h-12 sm:w-12"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Play className="h-4 w-4 translate-x-0.5 fill-current sm:h-5 sm:w-5" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={!currentTrack}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 sm:h-9 sm:w-9"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleLoop}
            disabled={!currentTrack}
            className={cn(
              "flex h-8 w-8 items-center justify-center transition-colors sm:h-9 sm:w-9",
              isLooping 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground",
              !currentTrack && "opacity-40"
            )}
            title={isLooping ? "Loop On" : "Loop Off"}
          >
            {isLooping ? (
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Right Side - Duration (desktop only) */}
        <div className="hidden items-center sm:flex sm:w-40 md:w-52 sm:justify-end">
          {currentTrack && (
            <span className="tabular-nums text-sm text-muted-foreground">
              {currentTrack.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
