import { mockRuns } from '../data/mockPath'
import type { PipelineRun } from '../types/path'
import { mapAzureBuildsToRuns, type AzureBuildsResponse } from './azureRuns'

export type RunsSource = 'live' | 'mock'

export type RunsFetchResult = {
  runs: PipelineRun[]
  source: RunsSource
  message: string
}

/**
 * Prefer live Azure runs from /api/runs.
 * Fall back to demo rows when the API is unavailable (local preview, missing secrets).
 */
export async function fetchRecentRuns(): Promise<RunsFetchResult> {
  try {
    const response = await fetch('/api/runs')
    if (!response.ok) {
      return {
        runs: mockRuns,
        source: 'mock',
        message: 'Demo history for walkthroughs. Connect Azure to show live pipeline runs.',
      }
    }

    const payload = (await response.json()) as AzureBuildsResponse
    const runs = mapAzureBuildsToRuns(payload)
    if (runs.length === 0) {
      return {
        runs: mockRuns,
        source: 'mock',
        message: 'Demo history for walkthroughs. Connect Azure to show live pipeline runs.',
      }
    }

    return {
      runs,
      source: 'live',
      message: 'Live Azure Pipelines runs for this lab.',
    }
  } catch {
    return {
      runs: mockRuns,
      source: 'mock',
      message: 'Demo history for walkthroughs. Connect Azure to show live pipeline runs.',
    }
  }
}
