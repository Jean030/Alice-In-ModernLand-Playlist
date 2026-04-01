"use client"

interface PlaylistHeaderProps {
  likedCount: number
  totalTracks: number
}

export function PlaylistHeader({ likedCount, totalTracks }: PlaylistHeaderProps) {
  return (
    <header className="mb-12 border-b border-border/50 pb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Original Musical Soundtrack
          </p>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            Alice in
            <br />
            <span className="text-primary">Modernland</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A noir journey through the looking glass. {totalTracks} tracks of 
            haunting melodies and modern rhythms, where wonderland meets 
            the shadows of the city.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums text-foreground">{totalTracks}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Tracks</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums text-primary">{likedCount}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Liked</p>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
        <div className="h-2 w-2 rotate-45 bg-primary" />
        <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
      </div>
    </header>
  )
}
