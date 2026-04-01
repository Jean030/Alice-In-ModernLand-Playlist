"use client"

import { Play, Pause, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Track } from "@/app/page"

interface TrackListProps {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  playMode: "sequence" | "shuffle" | "liked"
  onPlayTrack: (track: Track) => void
  onToggleLike: (trackId: number) => void
}

export function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  playMode,
  onPlayTrack,
  onToggleLike,
}: TrackListProps) {
  const displayTracks = playMode === "liked" ? tracks.filter((t) => t.isLiked) : tracks

  if (playMode === "liked" && displayTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
        <Heart className="mb-4 h-10 w-10 text-muted-foreground/30 sm:h-12 sm:w-12" />
        <p className="font-serif text-lg text-muted-foreground sm:text-xl">No liked tracks yet</p>
        <p className="mt-2 text-xs text-muted-foreground/60 sm:text-sm">
          Heart your favorite tracks to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5 sm:space-y-1">
      {/* Table Header - Hidden on mobile */}
      <div className="mb-3 hidden grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-border/30 px-4 pb-3 text-xs uppercase tracking-wider text-muted-foreground sm:grid">
        <span className="w-12 text-center">#</span>
        <span>Track</span>
        <span className="w-16 text-right">Duration</span>
        <span className="w-10" />
      </div>

      {/* Track Rows */}
      {displayTracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id
        const isCurrentlyPlaying = isCurrentTrack && isPlaying

        return (
          <div
            key={track.id}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 transition-all duration-200 sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 sm:px-4 sm:py-3",
              isCurrentTrack
                ? "bg-primary/10 border-l-2 border-l-primary"
                : "hover:bg-card/50 border-l-2 border-l-transparent active:bg-card/70"
            )}
          >
            {/* Track Code / Play Button */}
            <button
              onClick={() => onPlayTrack(track)}
              className="relative flex h-8 w-12 shrink-0 items-center justify-center"
            >
              <span
                className={cn(
                  "font-mono text-sm transition-opacity",
                  isCurrentTrack ? "text-primary" : "text-muted-foreground",
                  "group-hover:opacity-0"
                )}
              >
                {track.code}
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                {isCurrentlyPlaying ? (
                  <Pause className="h-4 w-4 text-primary" />
                ) : (
                  <Play className="h-4 w-4 fill-primary text-primary" />
                )}
              </span>
            </button>

            {/* Track Title - Clickable to play/pause */}
            <button
              onClick={() => onPlayTrack(track)}
              className="min-w-0 flex-1 text-left"
            >
              <p
                className={cn(
                  "truncate text-sm font-medium transition-colors sm:text-base",
                  isCurrentTrack ? "text-primary" : "text-foreground"
                )}
              >
                {track.title}
              </p>
              {/* Show duration on mobile below title */}
              <p className={cn(
                "text-xs sm:hidden",
                isCurrentTrack ? "text-primary/70" : "text-muted-foreground"
              )}>
                {track.duration}
              </p>
              {isCurrentlyPlaying && (
                <div className="mt-1 flex items-center gap-0.5">
                  <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "0ms" }} />
                  <span className="h-3 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "300ms" }} />
                  <span className="h-4 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "450ms" }} />
                  <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "600ms" }} />
                </div>
              )}
            </button>

            {/* Duration - Hidden on mobile (shown inline above) */}
            <span
              className={cn(
                "hidden w-16 text-right tabular-nums text-sm sm:block",
                isCurrentTrack ? "text-primary/80" : "text-muted-foreground"
              )}
            >
              {track.duration}
            </span>

            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike(track.id)
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all sm:h-4 sm:w-4",
                  track.isLiked
                    ? "fill-primary text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}
