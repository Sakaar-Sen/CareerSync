// src/pages/DashboardPage.jsx

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FileClock, ChevronRight, Download } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authTokens, logoutUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/history/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setHistory(response.data);
            } catch (err) {
                setError('Failed to load analysis history. Please try again.');
                if (err.response && err.response.status === 401) {
                    logoutUser();
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (authTokens) {
            fetchHistory();
        }
    }, [authTokens, logoutUser]);

    // --- NEW: Function to handle PDF download ---
    const handleDownload = (taskId) => {
        window.open(`http://127.0.0.1:8000/api/jobs/${taskId}/download/`, '_blank');
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Analysis History</h1>
                <Link to="/analyze" className="new-analysis-btn">New Analysis</Link>
            </header>
            <div className="dashboard-content">
                {isLoading && <p>Loading history...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && !error && history.length === 0 && (
                    <div className="no-history-card">
                        <FileClock size={48} />
                        <h2>No History Found</h2>
                        <p>You haven't analyzed any resumes yet. Get started by running your first analysis.</p>
                    </div>
                )}
                {!isLoading && !error && history.length > 0 && (
                    <div className="history-list">
                        {history.map((job) => (
                            // --- UPDATED: Item is now a button that triggers download ---
                            <button key={job.task_id} className="history-item" onClick={() => handleDownload(job.task_id)}>
                                <div className="history-item-info">
                                    <span className="history-date">
                                        {/* --- UPDATED: Date formatting now includes time --- */}
                                        {new Date(job.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <span className="history-score" style={{ color: job.result?.matchScore >= 75 ? '#4ade80' : job.result?.matchScore >= 50 ? '#f97316' : '#f43f5e' }}>
                                        {job.result?.matchScore}% Match Score
                                    </span>
                                </div>
                                <Download size={20} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
