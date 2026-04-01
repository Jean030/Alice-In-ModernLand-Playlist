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
    { id: "sequence" as const, label: "Sequence", icon: ListOrdered },
    { id: "shuffle" as const, label: "Shuffle", icon: Shuffle },
    { id: "liked" as const, label: "Liked", icon: Heart, count: likedCount },
  ]

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <span className="mr-2 text-xs uppercase tracking-wider text-muted-foreground">
        Play Mode
      </span>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setPlayMode(mode.id)}
          disabled={mode.id === "liked" && likedCount === 0}
          className={cn(
            "group flex items-center gap-2 border px-4 py-2 text-sm transition-all duration-300",
            playMode === mode.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
            mode.id === "liked" && likedCount === 0 && "cursor-not-allowed opacity-40"
          )}
        >
          <mode.icon
            className={cn(
              "h-4 w-4 transition-transform group-hover:scale-110",
              playMode === mode.id && mode.id === "liked" && "fill-primary"
            )}
          />
          <span className="uppercase tracking-wider">{mode.label}</span>
          {mode.count !== undefined && (
            <span className="ml-1 tabular-nums text-xs">({mode.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}
