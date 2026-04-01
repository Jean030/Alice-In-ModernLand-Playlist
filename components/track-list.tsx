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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="font-serif text-xl text-muted-foreground">No liked tracks yet</p>
        <p className="mt-2 text-sm text-muted-foreground/60">
          Heart your favorite tracks to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Table Header */}
      <div className="mb-4 grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-border/30 px-4 pb-3 text-xs uppercase tracking-wider text-muted-foreground md:grid-cols-[auto_1fr_1fr_auto_auto]">
        <span className="w-8 text-center">#</span>
        <span>Track</span>
        <span className="hidden md:block">Code</span>
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
              "group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 transition-all duration-200 md:grid-cols-[auto_1fr_1fr_auto_auto]",
              isCurrentTrack
                ? "bg-primary/10 border-l-2 border-l-primary"
                : "hover:bg-card/50 border-l-2 border-l-transparent"
            )}
          >
            {/* Track Number / Play Button */}
            <button
              onClick={() => onPlayTrack(track)}
              className="relative flex h-8 w-8 items-center justify-center"
            >
              <span
                className={cn(
                  "tabular-nums text-sm transition-opacity",
                  isCurrentTrack ? "text-primary" : "text-muted-foreground",
                  "group-hover:opacity-0"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                {isCurrentlyPlaying ? (
                  <Pause className="h-4 w-4 text-primary" />
                ) : (
                  <Play className="h-4 w-4 fill-primary text-primary" />
                )}
              </span>
            </button>

            {/* Track Title */}
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate font-medium transition-colors",
                  isCurrentTrack ? "text-primary" : "text-foreground"
                )}
              >
                {track.title}
              </p>
              {isCurrentlyPlaying && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "0ms" }} />
                  <span className="h-3 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "300ms" }} />
                  <span className="h-4 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "450ms" }} />
                  <span className="h-2 w-0.5 animate-pulse bg-primary" style={{ animationDelay: "600ms" }} />
                </div>
              )}
            </div>

            {/* Track Code */}
            <span
              className={cn(
                "hidden font-mono text-sm md:block",
                isCurrentTrack ? "text-primary/80" : "text-muted-foreground"
              )}
            >
              {track.code}
            </span>

            {/* Duration */}
            <span
              className={cn(
                "w-16 text-right tabular-nums text-sm",
                isCurrentTrack ? "text-primary/80" : "text-muted-foreground"
              )}
            >
              {track.duration}
            </span>

            {/* Like Button */}
            <button
              onClick={() => onToggleLike(track.id)}
              className="flex h-10 w-10 items-center justify-center transition-transform hover:scale-110"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all",
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
