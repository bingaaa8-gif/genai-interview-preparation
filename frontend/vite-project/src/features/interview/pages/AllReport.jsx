
import React, { useState, useEffect } from 'react';
import { Interviewhook } from '../../auth/hooks/Interviewhook';
import './allreports.scss';

const AllReport = () => {
  const [active, setActive] = useState(0);

  const { loading, reports, handleAllreports } = Interviewhook();

  useEffect(() => {
    handleAllreports();
  }, []);

  if (loading) {
    return (
      <div className="ar-page">
        <main className="ar-main">
          <div className="ar-message">
            <h2>Loading reports...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="ar-page">
        <main className="ar-main">
          <div className="ar-message">
            <h2>No reports available</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ar-page">
      <main className="ar-main">
        <aside className="ar-sidebar">
          <h2 className="ar-title">All Reports</h2>

          {reports.map((item, index) => (
            <button
              type="button"
              key={item._id || index}
              onClick={() => setActive(index)}
              className={`ar-report-button ${
                active === index ? 'ar-active' : ''
              }`}
            >
              <h3>Report number {index + 1}</h3>
            </button>
          ))}
        </aside>

        <section className="ar-details">
          {reports[active] && (
            <div className="ar-content">
              <h2 className="ar-title">Report Details</h2>

              <p>
                <strong>Match Score:</strong>{' '}
                {reports[active].matchscope}
              </p>

              <p>
                <strong>Job Description:</strong>{' '}
                {reports[active].jobDes}
              </p>

              <section className="ar-section">
                <h4>Technical Questions</h4>

                {reports[active].technicalQuestion?.map((item, index) => (
                  <div className="ar-question" key={index}>
                    <h3>Question {index + 1}</h3>
                    <p>
                      <strong>Question:</strong> {item.questions}
                    </p>
                    <p>
                      <strong>Intention:</strong> {item.intentions}
                    </p>
                    <p>
                      <strong>Answer:</strong> {item.answers}
                    </p>
                  </div>
                ))}
              </section>

              <section className="ar-section">
                <h4>Behavioral Questions</h4>

                {reports[active].behavioralQuesttions?.map((item, index) => (
                  <div className="ar-question" key={index}>
                    <h3>Question {index + 1}</h3>
                    <p>
                      <strong>Question:</strong> {item.questions}
                    </p>
                    <p>
                      <strong>Intention:</strong> {item.intentions}
                    </p>
                    <p>
                      <strong>Answer:</strong> {item.answers}
                    </p>
                  </div>
                ))}
              </section>

              <section className="ar-section">
                <h4>Skill Gap</h4>

                {reports[active].skillgap?.map((item, index) => (
                  <div className="ar-question" key={index}>
                    <h3>Skill Gap {index + 1}</h3>
                    <p>
                      {typeof item === 'string'
                        ? item
                        : JSON.stringify(item)}
                    </p>
                  </div>
                ))}
              </section>

              <section className="ar-section">
                <h4>Preparation Plan</h4>

                {reports[active].preprationplan?.map((item, index) => (
                  <div className="ar-question" key={index}>
                    <h3>Day {index + 1}</h3>
                    <p>
                      <strong>Focus:</strong> {item.focus}
                    </p>
                    <p>
                      <strong>Task:</strong> {item.task}
                    </p>
                  </div>
                ))}
              </section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AllReport;
