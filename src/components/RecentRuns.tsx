import type { PipelineRun } from '../types/path'
import type { RunsSource } from '../utils/fetchRecentRuns'
import { deployLabel, reasonLabel, smokeLabel } from '../utils/azureRuns'
import './RecentRuns.css'

type RecentRunsProps = {
  runs: PipelineRun[]
  source: RunsSource
  message: string
  loading: boolean
}

export function RecentRuns({ runs, source, message, loading }: RecentRunsProps) {
  return (
    <section className="recent-runs" aria-labelledby="recent-runs-heading">
      <div className="recent-runs__intro">
        <div>
          <h2 id="recent-runs-heading">Recent runs</h2>
          <p data-testid="runs-source-message">{loading ? 'Loading pipeline runs…' : message}</p>
        </div>
        <p className={`recent-runs__badge recent-runs__badge--${source}`} data-testid="runs-source">
          {loading ? 'Loading' : source === 'live' ? 'Live Azure' : 'Demo data'}
        </p>
      </div>

      <div className="recent-runs__table-wrap" role="region" aria-label="Recent pipeline runs">
        <table className="recent-runs__table">
          <thead>
            <tr>
              <th scope="col">Azure build</th>
              <th scope="col">Kind</th>
              <th scope="col">Smoke</th>
              <th scope="col">Staging</th>
              <th scope="col">Production</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                data-testid={run.id}
                className={
                  run.smoke === 'failed' || run.staging === 'blocked'
                    ? 'row-risk-high'
                    : undefined
                }
              >
                <td className="mono">{run.buildNumber}</td>
                <td>{reasonLabel(run.reason)}</td>
                <td>
                  <span className={`run-result run-result--${run.smoke}`}>
                    {smokeLabel(run.smoke)}
                  </span>
                </td>
                <td>
                  <span className={`run-result run-result--${run.staging}`}>
                    {deployLabel(run.staging, 'staging')}
                  </span>
                </td>
                <td>
                  <span className={`run-result run-result--${run.production}`}>
                    {deployLabel(run.production, 'production')}
                  </span>
                </td>
                <td className="mono">{run.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
