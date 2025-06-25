import React from 'react';

// PUBLIC_INTERFACE
function Scorecard({ score, explanation }) {
  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="fw-bold mb-1">AI Match Score</div>
      <div>
        <span style={{ fontSize: '2rem', fontWeight: 600, color: '#28a745' }}>{score}</span>/100
      </div>
      <div className="mt-2 text-secondary">
        {explanation}
      </div>
    </div>
  );
}

export default Scorecard;
