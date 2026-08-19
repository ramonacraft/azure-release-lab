export type ReleaseLane = 'local' | 'staging' | 'production'

export type SmokeResult = 'passed' | 'failed' | 'running' | 'skipped'
export type DeployResult = 'shipped' | 'blocked' | 'pending' | 'skipped'
export type RunReason = 'pr' | 'ci' | 'nightly' | 'manual'

export type PipelineRun = {
  id: string
  buildNumber: string
  branch: string
  reason: RunReason
  smoke: SmokeResult
  staging: DeployResult
  production: DeployResult
  duration: string
  startedAt: string
}

export type PathStepId = 'pr' | 'staging' | 'production' | 'nightly'

export type PathStep = {
  id: PathStepId
  title: string
  detail: string
}
