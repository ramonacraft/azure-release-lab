import type { PathStep, ReleaseLane } from '../types/path'
import './PathSteps.css'

type PathStepsProps = {
  steps: PathStep[]
  lane: ReleaseLane
}

function isCurrent(id: PathStep['id'], lane: ReleaseLane): boolean {
  if (id === 'staging') return lane === 'staging'
  if (id === 'production') return lane === 'production'
  if (id === 'pr') return lane === 'local'
  return false
}

export function PathSteps({ steps, lane }: PathStepsProps) {
  return (
    <section className="panel path-steps" aria-labelledby="path-steps-heading">
      <div className="panel__head">
        <h2 id="path-steps-heading">How a change moves</h2>
        <p>Four Azure stops. Staging ships on green main. Production waits for a person.</p>
      </div>
      <ul className="path-steps__list">
        {steps.map((step, index) => {
          const current = isCurrent(step.id, lane)
          return (
            <li
              key={step.id}
              className={current ? 'path-steps__item path-steps__item--current' : 'path-steps__item'}
              data-testid={`path-step-${step.id}`}
              data-current={current ? 'true' : 'false'}
            >
              <span className="path-steps__index">{index + 1}</span>
              <span>
                <span className="path-steps__title">{step.title}</span>
                <span className="path-steps__detail">{step.detail}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
