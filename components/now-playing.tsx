"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Track } from "@/app/page"

interface NowPlayingProps {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export function NowPlaying({
  currentTrack,
  isPlaying,
  progress,
  onTogglePlayPause,
  onNext,
  onPrevious,
}: NowPlayingProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        {/* Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center border",
              currentTrack ? "border-primary bg-primary/20" : "border-border bg-muted"
            )}
          >
            {currentTrack ? (
              <span className="font-mono text-xs font-bold text-primary">
                {currentTrack.code}
              </span>
            ) : (
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            {currentTrack ? (
              <>
                <p className="truncate font-medium text-foreground">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Alice in Modernland OST
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Select a track to play</p>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onPrevious}
            disabled={!currentTrack}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={onTogglePlayPause}
            className="flex h-14 w-14 items-center justify-center border border-primary bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5 fill-current" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={!currentTrack}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Right Side - Volume/Duration */}
        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          {currentTrack && (
            <span className="tabular-nums text-sm text-muted-foreground">
              {currentTrack.duration}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="h-1 w-20 bg-muted">
              <div className="h-full w-3/4 bg-primary/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
