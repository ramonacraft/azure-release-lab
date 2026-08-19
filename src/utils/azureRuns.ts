import type { DeployResult, PipelineRun, RunReason, SmokeResult } from '../types/path'

type AzureBuild = {
  id: number
  buildNumber: string
  status: string
  result?: string
  sourceBranch: string
  reason?: string
  startTime?: string
  finishTime?: string
  queueTime?: string
}

export type AzureBuildsResponse = {
  value?: AzureBuild[]
}

function branchName(ref: string): string {
  return ref.replace(/^refs\/heads\//, '').replace(/^refs\/pull\/\d+\/merge$/, 'pr-merge')
}

function durationLabel(start?: string, finish?: string): string {
  if (!start) return '—'
  const startMs = Date.parse(start)
  const endMs = Date.parse(finish || new Date().toISOString())
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) return '—'
  const totalSec = Math.round((endMs - startMs) / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  if (minutes <= 0) return `${seconds}s`
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

function mapSmoke(status: string, result?: string): SmokeResult {
  if (status === 'inProgress' || status === 'notStarted') return 'running'
  if (result === 'succeeded') return 'passed'
  if (result === 'failed' || result === 'canceled') return 'failed'
  return 'skipped'
}

function mapReason(reason?: string, branch?: string): RunReason {
  const value = (reason || '').toLowerCase()
  if (value.includes('schedule')) return 'nightly'
  if (value.includes('pullrequest') || branch === 'pr-merge') return 'pr'
  if (value.includes('manual')) return 'manual'
  return 'ci'
}

function mapStaging(reason: RunReason, smoke: SmokeResult, branch: string): DeployResult {
  if (reason === 'nightly' || reason === 'pr') return 'skipped'
  if (smoke === 'running') return 'pending'
  if (smoke === 'failed') return 'blocked'
  if (smoke === 'passed' && branch === 'main') return 'shipped'
  return 'skipped'
}

function mapProduction(reason: RunReason, smoke: SmokeResult, branch: string): DeployResult {
  if (reason === 'nightly' || reason === 'pr') return 'skipped'
  if (smoke === 'running') return 'pending'
  if (smoke === 'failed') return 'blocked'
  if (smoke === 'passed' && branch === 'main') return 'pending'
  return 'skipped'
}

export function mapAzureBuildsToRuns(payload: AzureBuildsResponse): PipelineRun[] {
  const builds = payload.value ?? []
  return builds.map((build) => {
    const branch = branchName(build.sourceBranch || '')
    const smoke = mapSmoke(build.status, build.result)
    const reason = mapReason(build.reason, branch)
    return {
      id: `azure-${build.id}`,
      buildNumber: build.buildNumber?.startsWith('#')
        ? build.buildNumber
        : `#${build.buildNumber}`,
      branch,
      reason,
      smoke,
      staging: mapStaging(reason, smoke, branch),
      production: mapProduction(reason, smoke, branch),
      duration: durationLabel(build.startTime || build.queueTime, build.finishTime),
      startedAt: build.startTime || build.queueTime || new Date().toISOString(),
    }
  })
}

export function smokeLabel(value: SmokeResult): string {
  if (value === 'passed') return 'Smoke passed'
  if (value === 'failed') return 'Smoke failed'
  if (value === 'running') return 'Smoke running'
  return 'Smoke skipped'
}

export function deployLabel(value: DeployResult, lane: 'staging' | 'production'): string {
  const name = lane === 'staging' ? 'Staging' : 'Production'
  if (value === 'shipped') return `${name} shipped`
  if (value === 'blocked') return `${name} blocked`
  if (value === 'pending') return `${name} waiting`
  return `${name} skipped`
}

export function reasonLabel(value: RunReason): string {
  if (value === 'pr') return 'PR'
  if (value === 'nightly') return 'Nightly'
  if (value === 'manual') return 'Manual'
  return 'CI'
}
