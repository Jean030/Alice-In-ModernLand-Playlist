"use client"

interface PlaylistHeaderProps {
  likedCount: number
  totalTracks: number
  coverImage: string | null
  onCoverClick: () => void
}

export function PlaylistHeader({ 
  likedCount, 
  totalTracks, 
  coverImage,
  onCoverClick
}: PlaylistHeaderProps) {
  return (
    <header className="mb-8 border-b border-border/50 pb-6 sm:mb-12 sm:pb-8">
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
        {/* Album Cover + Title Section */}
        <div className="flex gap-4 sm:gap-6">
          {/* Album Cover - Click to fullscreen */}
          <div className="relative shrink-0">
            <button
              onClick={onCoverClick}
              className="group relative flex h-24 w-24 items-center justify-center overflow-hidden border-2 border-primary/30 bg-card transition-all hover:border-primary sm:h-32 sm:w-32 md:h-40 md:w-40"
            >
              {coverImage ? (
                <>
                  <img
                    src={coverImage}
                    alt="Album cover"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100" />
                </>
              ) : (
                <div className="text-xs uppercase tracking-wider text-muted-foreground">No Cover</div>
              )}
            </button>
          </div>

          {/* Title Section */}
          <div className="flex flex-col justify-end space-y-2 sm:space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.3em]">
              Original Musical Soundtrack
            </p>
            <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Alice in
              <br />
              <span className="text-primary">Modernland</span>
            </h1>
            <p className="hidden max-w-md text-sm leading-relaxed text-muted-foreground sm:block">
            多年以后，爱丽丝仍然会时不时想起这个怪梦。真的只是梦吗？ 噗抓马Pusical2026春演原创音乐剧《爱丽丝与冷酷仙境》{totalTracks} 首原创歌曲。
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="text-left sm:text-right">
            <p className="text-xl font-bold tabular-nums text-foreground sm:text-3xl">{totalTracks}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">Tracks</p>
          </div>
          <div className="h-8 w-px bg-border sm:h-12" />
          <div className="text-left sm:text-right">
            <p className="text-xl font-bold tabular-nums text-primary sm:text-3xl">{likedCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">Liked</p>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-6 flex items-center gap-4 sm:mt-8">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
        <div className="h-1.5 w-1.5 rotate-45 bg-primary sm:h-2 sm:w-2" />
        <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
      </div>
    </header>
  )
}
