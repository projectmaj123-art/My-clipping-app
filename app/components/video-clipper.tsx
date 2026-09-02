'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Clapperboard,
  DownloadCloud,
  Link2,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClipCard } from '@/components/clip-card'
import { sampleClips } from '@/lib/clips'

type Status = 'idle' | 'processing' | 'done'

const STEPS = [
  'Fetching video',
  'Transcribing audio',
  'Finding key moments',
  'Rendering clips',
]

export function VideoClipper() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [step, setStep] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [])

  function isValidUrl(value: string) {
    try {
      const u = new URL(value.trim())
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidUrl(url) || status === 'processing') return

    setStatus('processing')
    setStep(0)
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []

    STEPS.forEach((_, i) => {
      if (i === 0) return
      timers.current.push(window.setTimeout(() => setStep(i), i * 750))
    })
    timers.current.push(
      window.setTimeout(() => setStatus('done'), STEPS.length * 750),
    )
  }

  const validUrl = isValidUrl(url)

  return (
    <div className="flex flex-col gap-10">
      {/* Input panel */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a YouTube, TikTok, or video URL…"
              aria-label="Video URL"
              className="h-12 border-input bg-background pl-10 text-base"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!validUrl || status === 'processing'}
            className="h-12 shrink-0 px-6"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Clipping…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate clips
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        {status === 'processing' && (
          <ProcessingBar step={step} />
        )}
      </form>

      {/* Results */}
      {status === 'done' && (
        <section className="flex flex-col gap-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {sampleClips.length} clips ready
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by predicted engagement. Preview and download your
                favorites.
              </p>
            </div>
            <Button variant="secondary" className="gap-2">
              <DownloadCloud className="size-4" />
              Download all
            </Button>
          </header>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sampleClips.map((clip, i) => (
              <ClipCard key={clip.id} clip={clip} index={i} />
            ))}
          </div>
        </section>
      )}

      {status === 'idle' && <EmptyState />}
    </div>
  )
}

function ProcessingBar({ step }: { step: number }) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <div className="flex h-1.5 gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-full flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: i <= step ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin text-primary" />
        {STEPS[step]}…
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-primary">
        <Clapperboard className="size-6" />
      </div>
      <p className="text-sm font-medium">No clips yet</p>
      <p className="max-w-xs text-pretty text-sm text-muted-foreground">
        Drop a video link above and AI will pull out the most share-worthy
        moments in seconds.
      </p>
    </div>
  )
}
