"use client"

import { Shuffle, ListOrdered, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaybackControlsProps {
  playMode: "sequence" | "shuffle" | "liked"
  setPlayMode: (mode: "sequence" | "shuffle" | "liked") => void
  likedCount: number
}

export function PlaybackControls({
  playMode,
  setPlayMode,
  likedCount,
}: PlaybackControlsProps) {
  const modes = [
    { id: "sequence" as const, label: "Sequence", shortLabel: "Seq", icon: ListOrdered },
    { id: "shuffle" as const, label: "Shuffle", shortLabel: "Shuf", icon: Shuffle },
    { id: "liked" as const, label: "Liked", shortLabel: "Liked", icon: Heart, count: likedCount },
  ]

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8 sm:gap-3">
      <span className="mr-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:mr-2 sm:text-xs">
        Mode
      </span>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setPlayMode(mode.id)}
          disabled={mode.id === "liked" && likedCount === 0}
          className={cn(
            "group flex items-center gap-1.5 border px-2.5 py-1.5 text-xs transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
            playMode === mode.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
            mode.id === "liked" && likedCount === 0 && "cursor-not-allowed opacity-40"
          )}
        >
          <mode.icon
            className={cn(
              "h-3.5 w-3.5 transition-transform group-hover:scale-110 sm:h-4 sm:w-4",
              playMode === mode.id && mode.id === "liked" && "fill-primary"
            )}
          />
          <span className="uppercase tracking-wider">
            <span className="sm:hidden">{mode.shortLabel}</span>
            <span className="hidden sm:inline">{mode.label}</span>
          </span>
          {mode.count !== undefined && (
            <span className="ml-0.5 tabular-nums text-[10px] sm:ml-1 sm:text-xs">({mode.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}
