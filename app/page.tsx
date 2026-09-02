import { Scissors, Sparkles } from 'lucide-react'
import { VideoClipper } from './components/video-clipper'

export default function Page() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scissors className="size-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Clipster</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            AI powered
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Turn long videos into{' '}
            <span className="text-primary">viral clips</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Paste a link and let AI find the best moments, cut them into
            short-form clips, and hand them back ready to download.
          </p>
        </section>

        <VideoClipper/>
      </div>
    </main>
  )
}
