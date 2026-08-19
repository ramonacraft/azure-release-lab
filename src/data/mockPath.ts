import type { PathStep, PipelineRun, ReleaseLane } from '../types/path'

export const pathSteps: PathStep[] = [
  {
    id: 'pr',
    title: 'PR smoke',
    detail: 'Build + Playwright. No deploy.',
  },
  {
    id: 'staging',
    title: 'Staging',
    detail: 'Green main deploys here automatically.',
  },
  {
    id: 'production',
    title: 'Production',
    detail: 'Azure waits for a person to approve, then ships.',
  },
  {
    id: 'nightly',
    title: 'Nightly',
    detail: 'Scheduled smoke on main. No deploy.',
  },
]

export const mockRuns: PipelineRun[] = [
  {
    id: 'run-2204',
    buildNumber: '#2204',
    branch: 'main',
    reason: 'ci',
    smoke: 'passed',
    staging: 'shipped',
    production: 'pending',
    duration: '4m 12s',
    startedAt: '2026-08-18T16:04:00.000Z',
  },
  {
    id: 'run-2203',
    buildNumber: '#2203',
    branch: 'main',
    reason: 'nightly',
    smoke: 'passed',
    staging: 'skipped',
    production: 'skipped',
    duration: '3m 40s',
    startedAt: '2026-08-18T07:00:00.000Z',
  },
  {
    id: 'run-2202',
    buildNumber: '#2202',
    branch: 'pr-merge',
    reason: 'pr',
    smoke: 'passed',
    staging: 'skipped',
    production: 'skipped',
    duration: '3m 18s',
    startedAt: '2026-08-18T15:21:00.000Z',
  },
  {
    id: 'run-2201',
    buildNumber: '#2201',
    branch: 'main',
    reason: 'ci',
    smoke: 'failed',
    staging: 'blocked',
    production: 'blocked',
    duration: '2m 05s',
    startedAt: '2026-08-18T14:44:00.000Z',
  },
]

export const mockLane: ReleaseLane = 'local'
