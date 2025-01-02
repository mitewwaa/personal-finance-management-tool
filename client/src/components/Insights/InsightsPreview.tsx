import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/InsightsPreview.css';

interface InsightsPreviewProps {
  insights: Insight[];
}

export interface Insight {
  id: string;
  name: string;
  category: string;
  message: string;
  type: 'critical' | 'warning' | 'positive' | 'neutral';
  createdAt: string;
}

const InsightsPreview: React.FC<InsightsPreviewProps> = ({ insights }) => {
  const navigate = useNavigate();

  const determineInsightType = (message: string): 'critical' | 'warning' | 'positive' | 'neutral' => {
    if (message.includes('exceeded your budget')) {
      return 'critical';
    }
    if (message.includes('Reduce your expenses') || message.includes('spend less than planned')) {
      return 'warning';
    }
    if (message.includes('reduce your budget') || message.includes('compensate for your overspending')) {
      return 'positive';
    }
    return 'neutral';
  };

  const insightsWithType = insights.map(insight => ({
    ...insight,
    type: determineInsightType(insight.message),
  }));

  const sortedInsights = [...insightsWithType].sort((a, b) => {
    const priorityOrder: Record<string, number> = {
      'critical': 1,
      'warning': 2,
      'positive': 3,
      'neutral': 4,
    };

    const priorityA = priorityOrder[a.type];
    const priorityB = priorityOrder[b.type];

    return priorityA - priorityB;
  });

  const displayedInsights = sortedInsights.slice(0, 3);

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

  return (
    <div className="insightsPreviewContainer">
      <h2 className='title'>Insights</h2>
      {insights.length === 0 ? (
        <p className='txtProfile'>No insights available. Add a budget and see the magic!</p>
      ) : (
        <>
          <div className="insightsList">
            {displayedInsights.map((insight) => {
              const { className, icon } = getInsightStyle(insight.message);
              return (
                <div key={insight.id} className={`insight ${className}`}>
                  <h4>{icon} {insight.name}</h4>
                  <h5>Category: {insight.category}</h5>
                  <p>{insight.message}</p>
                </div>
              );
            })}
          </div>
          <button className="viewAllButton" onClick={() => navigate('/profile#insights')}>View All</button>
        </>
      )}
    </div>
  );
};

export default InsightsPreview;