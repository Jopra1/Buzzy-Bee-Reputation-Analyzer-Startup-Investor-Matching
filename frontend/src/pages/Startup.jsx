import React, { useState } from 'react';

export default function Startup() {
  const [reputation, setReputation] = useState(null);
  const [lookingForInvestors, setLooking] = useState(false);
  const [availableInvestors, setInvestors] = useState([]);

  const analyzeReputation = async () => {
    // call backend after integration
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ company: 'My Startup' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setReputation(data);
  };

  const findInvestors = async () => {
    const res = await fetch('/api/match-investors', {
      method: 'POST',
      body: JSON.stringify({ reputationScore: reputation.score }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setInvestors(data.investors);
  };

  return (
    <div className="container">
      <h1>Startup Dashboard</h1>
      {!reputation && (
        <button onClick={analyzeReputation} style={{ marginTop: '1rem' }}>
          Check My Reputation
        </button>
      )}
      {reputation && (
        <>
          <h2 style={{ marginTop: '1rem' }}>
            Your Score: {reputation.score}/100
          </h2>
          <button
            onClick={() => {
              setLooking(true);
              findInvestors();
            }}
            style={{ marginTop: '1rem' }}
          >
            {lookingForInvestors ? 'Refresh Matches' : 'Find Investors'}
          </button>
        </>
      )}
      {availableInvestors.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Potential Investors</h3>
          <ul>
            {availableInvestors.map((inv) => (
              <li key={inv.id}>
                <strong>{inv.name}</strong> – Score match: {inv.matchScore}/100
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
