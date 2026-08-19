import './RollbackNote.css'

export function RollbackNote() {
  return (
    <section className="panel rollback-note" aria-labelledby="rollback-heading">
      <div className="panel__head">
        <h2 id="rollback-heading">Rollback</h2>
        <p>Production still asks for approval. You are choosing an older good run, not skipping the path.</p>
      </div>
      <ol className="rollback-note__steps">
        <li>Open the last green Azure run that already reached production.</li>
        <li>Rerun the <strong>Deploy production</strong> stage.</li>
        <li>Approve again when Azure pauses.</li>
      </ol>
      <p className="rollback-note__hint">
        Red smoke never deploys. Nightly never deploys. Rollback is only for a production site you already trust.
      </p>
    </section>
  )
}
