import React, { useState } from 'react';

export default function Investor() {
  const [reputation, setReputation] = useState(null);
  const [startups, setStartups] = useState([]);

  const analyzeReputation = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ company: 'My Investor Name' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setReputation(data);
  };

  const findStartups = async () => {
    const res = await fetch('/api/match-startups', {
      method: 'POST',
      body: JSON.stringify({ reputationScore: reputation.score }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setStartups(data.startups);
  };

  return (
    <div className="container">
      <h1>Investor Dashboard</h1>
      {!reputation && (
        <button onClick={analyzeReputation} style={{ marginTop: '1rem' }}>
          Check My Reputation
        </button>
      )}
      {reputation && (
        <>
          <h2 style={{ marginTop: '1rem' }}>
            Your Reputation Score: {reputation.score}/100
          </h2>
          <button
            onClick={findStartups}
            style={{ marginTop: '1rem' }}
          >
            Find Startups
          </button>
        </>
      )}
      {startups.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Startups for You</h3>
          <ul>
            {startups.map((su) => (
              <li key={su.id}>
                <strong>{su.name}</strong> – Match Score: {su.matchScore}/100
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
