import { useState } from 'react';

export default function Home() {
  const [business, setBusiness] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalysis({
      score: 82,
      suggestions: [
        'Boost social media engagement',
        'Publish more customer success stories',
        'Improve response time to reviews'
      ],
    });
  };

  return (
    <div className="container">
      <h1>Reputation Analyzer</h1>
      <form onSubmit={handleAnalyze} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Enter company name"
          value={business}
          onChange={e => setBusiness(e.target.value)}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Analyze</button>
      </form>
      {analysis && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Score: {analysis.score}/100</h2>
          <ul style={{ marginTop: '0.5rem' }}>
            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
