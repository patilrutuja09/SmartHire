// Signature UI element: visualizes an application's progress through the
// recruitment pipeline (Applied -> Shortlisted -> Hired), or a Rejected branch.
const STEPS = ['applied', 'shortlisted', 'hired'];

export default function PipelineTrack({ status }) {
  if (status === 'rejected') {
    return (
      <div>
        <div className="pipeline-track">
          <div className="pipeline-step">
            <div className="pipeline-dot done">✓</div>
          </div>
          <div className="pipeline-line done" />
          <div className="pipeline-step">
            <div className="pipeline-dot danger">✕</div>
          </div>
        </div>
        <div className="pipeline-labels" style={{ width: 48 }}>
          <span>Applied</span>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div>
      <div className="pipeline-track">
        {STEPS.map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="pipeline-step">
              <div
                className={
                  'pipeline-dot ' +
                  (i < currentIndex ? 'done' : i === currentIndex ? 'current' : '')
                }
              >
                {i <= currentIndex ? '✓' : i + 1}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={'pipeline-line ' + (i < currentIndex ? 'done' : '')} />
            )}
          </div>
        ))}
      </div>
      <div className="pipeline-labels" style={{ width: 96 }}>
        <span>Applied</span>
        <span>Shortlist</span>
        <span>Hired</span>
      </div>
    </div>
  );
}
