import { useState } from 'react';
import { Lightbulb, Check, X, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import './ResultsDisplay.css';

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button onClick={handleCopy} className="copy-button" title="Copy to clipboard">
      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

const ScoreDonutChart = ({ score }) => {
  const circumference = 2 * Math.PI * 55;
  const offset = circumference - (score / 100) * circumference;

  let scoreColor = '#f43f5e'; // Red
  if (score >= 50) scoreColor = '#f97316'; // Orange
  if (score >= 75) scoreColor = '#4ade80'; // Green

  return (
    <div className="score-chart-container">
      <svg className="score-donut" width="140" height="140">
        <circle className="score-donut-bg" cx="70" cy="70" r="55" />
        <circle
          className="score-donut-fg"
          cx="70" cy="70" r="55"
          stroke={scoreColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-chart-text">{score}%</div>
      <div className="score-chart-label">Match Score</div>
    </div>
  );
};

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  const { matchScore, keywordAnalysis, summarySuggestion, bulletPointSuggestions } = result;

  return (
    <div id="analysis-report" className="results-display">
      <h2 className="results-main-title">Analysis Report</h2>
      
      <div className="results-grid">
        <div className="results-card score-card">
          <ScoreDonutChart score={matchScore} />
        </div>
        
        <div className="results-card keywords-card">
          <h3 className="results-card-title">Keyword Analysis</h3>
          <div className="keywords-section">
            <h4><Check size={16} className="icon-strong" /> Strong Keywords</h4>
            <div className="pills-container">
              {keywordAnalysis.strongKeywords.map(kw => <span key={kw} className="pill pill-strong">{kw}</span>)}
            </div>
          </div>
          <div className="keywords-section">
            <h4><X size={16} className="icon-missing" /> Missing Keywords</h4>
            <div className="pills-container">
              {keywordAnalysis.missingKeywords.map(kw => <span key={kw} className="pill pill-missing">{kw}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="results-card suggestion-card">
        <div className="card-header">
          <h3 className="results-card-title"><Lightbulb size={20} /> AI Summary Suggestion</h3>
          <CopyButton textToCopy={summarySuggestion} />
        </div>
        <p className="suggestion-text">{summarySuggestion}</p>
      </div>

      {bulletPointSuggestions?.map((suggestion, index) => (
         <div key={index} className="results-card suggestion-card">
            <div className="card-header">
                <h3 className="results-card-title"><Lightbulb size={20} /> AI Bullet Point Suggestion</h3>
                <CopyButton textToCopy={suggestion.rewritten} />
            </div>
            <div className="diff-container">
                <div className="diff-section original">
                    <strong>Original:</strong>
                    <p>"{suggestion.original}"</p>
                </div>
                <ArrowRight className="diff-arrow" size={24} />
                <div className="diff-section rewritten">
                    <strong>Rewritten:</strong>
                    <p>"{suggestion.rewritten}"</p>
                </div>
            </div>
         </div>
      ))}
    </div>
  );
};

export default ResultsDisplay;
