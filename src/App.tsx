import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { PathHero } from './components/PathHero'
import { PathSteps } from './components/PathSteps'
import { RecentRuns } from './components/RecentRuns'
import { RollbackNote } from './components/RollbackNote'
import { pathSteps, mockRuns } from './data/mockPath'
import { fetchRecentRuns, type RunsSource } from './utils/fetchRecentRuns'
import { detectLane } from './utils/lane'
import type { PipelineRun } from './types/path'
import './App.css'

function App() {
  const lane = detectLane()
  const [runs, setRuns] = useState<PipelineRun[]>(mockRuns)
  const [runsSource, setRunsSource] = useState<RunsSource>('mock')
  const [runsMessage, setRunsMessage] = useState('Loading pipeline runs…')
  const [runsLoading, setRunsLoading] = useState(true)

  useEffect(() => {
    let active = true

    void fetchRecentRuns().then((result) => {
      if (!active) return
      setRuns(result.runs)
      setRunsSource(result.source)
      setRunsMessage(result.message)
      setRunsLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="shell">
      <nav className="shell__nav" aria-label="Azure Release Lab Dashboard">
        <div className="shell__nav-center">
          <p className="shell__logo">
            <span aria-hidden="true">👩‍💻</span>
            <span>Azure Release Lab Dashboard</span>
            <span aria-hidden="true">☁️</span>
          </p>
          <span className="shell__env-chip" data-testid="env-chip">
            {lane}
          </span>
        </div>
      </nav>

      <div className="shell__content">
        <PathHero lane={lane} />

        <div className="shell__board">
          <PathSteps steps={pathSteps} lane={lane} />
          <RollbackNote />
        </div>

        <RecentRuns
          runs={runs}
          source={runsSource}
          message={runsMessage}
          loading={runsLoading}
        />

        <footer className="shell__footer">
          <p>PR smoke, staging, production approval, nightly. Web only. Azure owns the path.</p>
          <p className="shell__footer-credit">
            <span>Ramona Bonitatis</span>
            <a
              href="https://github.com/ramonacraft/azure-release-lab"
              target="_blank"
              rel="noreferrer"
            >
              github.com/ramonacraft/azure-release-lab
            </a>
          </p>
        </footer>
      </div>
      <Analytics />
    </div>
  )
}

export default App
