import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/BudgetInsights.css';
import { FaFilter } from 'react-icons/fa';

interface Insight {
    budgetId: string;
    name: string;
    category: string;
    message: string;
}

const BudgetInsights = ({ userId }: { userId: string }) => {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
    
        if (token) {
            axios.get(`http://localhost:3000/budgets/users/${userId}/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setInsights(response.data);
            })
            .catch(error => {
                console.error('Error fetching budget insights:', error);
            });
        } else {
            console.error('JWT token is missing');
        }
    }, [userId]);

    const getInsightStyle = (message: string) => {
        if (message.includes('You can reduce your budget')) {
            return { className: 'insight-positive', icon: '✅' };
        }
        if (message.includes('You have spent') && message.includes('Reduce your expenses')) {
            return { className: 'insight-warning', icon: '⚠️' };
        }
        if (message.includes('You have exceeded your budget')) {
            return { className: 'insight-critical', icon: '❌' };
        }

        return { className: 'insight-neutral', icon: 'ℹ️' };
    };

    const categorizeInsights = (insights: Insight[]) => {
        const critical: Insight[] = [];
        const warning: Insight[] = [];
        const positive: Insight[] = [];
        const neutral: Insight[] = [];

        insights.forEach((insight: Insight) => {
            const { className } = getInsightStyle(insight.message);
            if (className === 'insight-critical') critical.push(insight);
            if (className === 'insight-warning') warning.push(insight);
            if (className === 'insight-positive') positive.push(insight);
            if (className === 'insight-neutral') neutral.push(insight);
        });

        return { critical, warning, positive, neutral };
    };

    const { critical, warning, positive, neutral } = categorizeInsights(insights);

    const filteredInsights = (() => {
        if (filterType === 'critical') return critical;
        if (filterType === 'warning') return warning;
        if (filterType === 'positive') return positive;
        if (filterType === 'neutral') return neutral;
        return [...critical, ...warning, ...positive, ...neutral];
    })();

    const renderNoInsightsMessage = (type: string) => {
        return <p className='txtProfile'>No {type} insights available.</p>;
    };

    return (
        <div>
            <h2 className='secondaryTitle'>Budget Insights</h2>

            <div className="filters">
                <FaFilter className="filterIcon" />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Insights</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                </select>
            </div>

            {insights.length > 0 ? (
                <div className="insights-container">
                    {filterType === 'critical' && (
                        <div className="insight-column">
                            <h3>Critical</h3>
                            {critical.length > 0 ? (
                                critical.map((insight: Insight) => (
                                    <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                        <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                        <h5>Category: {insight.category}</h5>
                                        <p>{insight.message}</p>
                                    </div>
                                ))
                            ) : renderNoInsightsMessage('critical')}
                        </div>
                    )}

                    {filterType === 'warning' && (
                        <div className="insight-column">
                            <h3>Warning</h3>
                            {warning.length > 0 ? (
                                warning.map((insight: Insight) => (
                                    <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                        <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                        <h5>Category: {insight.category}</h5>
                                        <p>{insight.message}</p>
                                    </div>
                                ))
                            ) : renderNoInsightsMessage('warning')}
                        </div>
                    )}

                    {filterType === 'positive' && (
                        <div className="insight-column">
                            <h3>Positive</h3>
                            {positive.length > 0 ? (
                                positive.map((insight: Insight) => (
                                    <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                        <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                        <h5>Category: {insight.category}</h5>
                                        <p>{insight.message}</p>
                                    </div>
                                ))
                            ) : renderNoInsightsMessage('positive')}
                        </div>
                    )}

                    {filterType === 'neutral' && (
                        <div className="insight-column">
                            <h3>Neutral</h3>
                            {neutral.length > 0 ? (
                                neutral.map((insight: Insight) => (
                                    <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                        <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                        <h5>Category: {insight.category}</h5>
                                        <p>{insight.message}</p>
                                    </div>
                                ))
                            ) : renderNoInsightsMessage('neutral')}
                        </div>
                    )}

                    {filterType === 'all' && (
                        <>
                            <div className="insight-column">
                                <h3>Critical</h3>
                                {critical.length > 0 ? (
                                    critical.map((insight: Insight) => (
                                        <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                            <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                            <h5>Category: {insight.category}</h5>
                                            <p>{insight.message}</p>
                                        </div>
                                    ))
                                ) : renderNoInsightsMessage('critical')}
                            </div>

                            <div className="insight-column">
                                <h3>Warning</h3>
                                {warning.length > 0 ? (
                                    warning.map((insight: Insight) => (
                                        <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                            <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                            <h5>Category: {insight.category}</h5>
                                            <p>{insight.message}</p>
                                        </div>
                                    ))
                                ) : renderNoInsightsMessage('warning')}
                            </div>

                            <div className="insight-column">
                                <h3>Positive</h3>
                                {positive.length > 0 ? (
                                    positive.map((insight: Insight) => (
                                        <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                            <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                            <h5>Category: {insight.category}</h5>
                                            <p>{insight.message}</p>
                                        </div>
                                    ))
                                ) : renderNoInsightsMessage('positive')}
                            </div>

                            <div className="insight-column">
                                <h3>Neutral</h3>
                                {neutral.length > 0 ? (
                                    neutral.map((insight: Insight) => (
                                        <div key={insight.budgetId} className={`insight-card ${getInsightStyle(insight.message).className}`}>
                                            <h4>{getInsightStyle(insight.message).icon} Budget: {insight.name}</h4>
                                            <h5>Category: {insight.category}</h5>
                                            <p>{insight.message}</p>
                                        </div>
                                    ))
                                ) : renderNoInsightsMessage('neutral')}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p className='txtProfile'>No insights available. Add a budget and see the magic!</p>
            )}
        </div>
    );
};

export default BudgetInsights;