import type { ReleaseLane } from '../types/path'
import { laneHeadline, laneLabel, laneSupport } from '../utils/lane'
import './PathHero.css'

type PathHeroProps = {
  lane: ReleaseLane
}

function barClass(lane: ReleaseLane, step: 'pr' | 'staging' | 'production' | 'nightly'): string {
  if (step === 'pr') return 'hi-teal'
  if (step === 'staging') {
    if (lane === 'local') return 'hi-slate'
    return 'hi-amber'
  }
  if (step === 'production') {
    if (lane === 'production') return 'hi-teal'
    if (lane === 'staging') return 'hi-amber'
    return 'hi-slate'
  }
  return lane === 'local' ? 'hi-slate' : 'hi-blue'
}

function fillPercent(lane: ReleaseLane, step: 'pr' | 'staging' | 'production' | 'nightly'): number {
  if (step === 'pr') return 100
  if (step === 'staging') {
    if (lane === 'local') return 20
    return 100
  }
  if (step === 'production') {
    if (lane === 'production') return 100
    if (lane === 'staging') return 45
    return 15
  }
  return lane === 'local' ? 15 : 70
}

function stepDetail(lane: ReleaseLane, step: 'pr' | 'staging' | 'production' | 'nightly'): string {
  if (step === 'pr') return 'Required on every change'
  if (step === 'staging') {
    if (lane === 'local') return 'Waits for green main'
    if (lane === 'staging') return 'This site'
    return 'Cleared'
  }
  if (step === 'production') {
    if (lane === 'production') return 'This site'
    if (lane === 'staging') return 'Waiting for approval'
    return 'After staging + approval'
  }
  return 'Smoke only, no deploy'
}

export function PathHero({ lane }: PathHeroProps) {
  const headline = laneHeadline(lane)
  const headlineEmoji = lane === 'production' ? '🚀' : lane === 'staging' ? '🧪' : '🧭'
  const rows = [
    { key: 'pr' as const, label: '1. PR smoke', detail: stepDetail(lane, 'pr') },
    { key: 'staging' as const, label: '2. Staging', detail: stepDetail(lane, 'staging') },
    { key: 'production' as const, label: '3. Production', detail: stepDetail(lane, 'production') },
    { key: 'nightly' as const, label: '4. Nightly', detail: stepDetail(lane, 'nightly') },
  ]

  return (
    <header className="path-pulse" data-lane={lane}>
      <div className="path-pulse__left">
        <p className="path-pulse__label">Release path</p>
        <p className="path-pulse__emoji" aria-hidden="true">
          {headlineEmoji}
        </p>
        <h1 className="path-pulse__headline" data-testid="path-headline">
          {headline}
        </h1>
        <p className="path-pulse__env" data-testid="path-lane-label">
          {laneLabel(lane)}
        </p>
      </div>

      <div className="path-pulse__right">
        <p className="path-pulse__support">{laneSupport(lane)}</p>
        <div className="path-pulse__rows" aria-label="Release path bars">
          {rows.map((row) => (
            <div key={row.key} className="path-pulse__row">
              <div className="path-pulse__row-label">
                <span>{row.label}</span>
                <span>{row.detail}</span>
              </div>
              <div className="path-pulse__bar" aria-hidden="true">
                <span
                  className={`path-pulse__bar-fill path-pulse__bar-fill--${barClass(lane, row.key)}`}
                  style={{ width: `${fillPercent(lane, row.key)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="path-pulse__chips" aria-label="Current lane">
          <span className={`status-chip status-chip--${lane}`}>{laneLabel(lane)}</span>
          <span className="status-chip">Web only</span>
          <span className="status-chip">Azure Pipelines</span>
        </div>
      </div>
    </header>
  )
}
