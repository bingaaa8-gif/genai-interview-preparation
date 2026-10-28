
import { useState, useEffect } from "react";
import "./report.scss";
import { Interviewhook } from "../../auth/hooks/Interviewhook";
import { useParams } from "react-router";

function Report() {
  const [activeSection, setActiveSection] = useState("Overall Report");
  const [reportState, setReportState] = useState("loading");

  const { id } = useParams();

  const { report, handlereportbyid } = Interviewhook();

  useEffect(() => {
    const loadReport = async () => {
      if (!id) {
        setReportState("error");
        return;
      }

      setReportState("loading");

      const success = await handlereportbyid(id);

      if (success) {
        setReportState("loaded");
      } else {
        setReportState("error");
      }
    };

    loadReport();
  }, [id]);

  if (reportState === "loading") {
    return (
      <main>
        <h1>Loading report......</h1>
      </main>
    );
  }

  if (
    reportState === "error" ||
    !report ||
    String(report._id) !== id
  ) {
    return (
      <main>
        <h1>Report available nahi hai.</h1>
      </main>
    );
  }

  const sections = [
    "Overall Report",
    "Technical Questions",
    "Behavioral Questions",
    "Skill Gap",
    "Preparation Plan"
  ];

  return (
    <div className="report-page">
      <aside className="report-sidebar">
        <h2>Interview Report</h2>

        {sections.map((section, index) => (
          <button
            key={index}
            className={activeSection === section ? "active" : ""}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </aside>

      <main className="report-content">
        <h1>{activeSection}</h1>

        {activeSection === "Overall Report" && (
          <div className="report-card">
            <h2>Match Score</h2>
            <p>
              {report.matchscope == null
                ? "Not available"
                : `${report.matchscope}%`}
            </p>

            <h3>Job Description</h3>
            <p>{report.jobDes || "Not available"}</p>

            <h3>Resume</h3>
            <p>{report.resume || "Not available"}</p>

            <h3>Self Description</h3>
            <p>{report.selfDes || "Not available"}</p>
          </div>
        )}

        {activeSection === "Technical Questions" && (
          <div className="report-card">
            {report.technicalQuestion?.length > 0 ? (
              report.technicalQuestion.map((item, index) => (
                <div key={index} className="report-item">
                  <h3>Question {index + 1}</h3>
                  <p><strong>Question:</strong> {item.questions}</p>
                  <p><strong>Intention:</strong> {item.intentions}</p>
                  <p><strong>Answer:</strong> {item.answers}</p>
                </div>
              ))
            ) : (
              <p>No technical questions available.</p>
            )}
          </div>
        )}

        {activeSection === "Behavioral Questions" && (
          <div className="report-card">
            {report.behavioralQuesttions?.length > 0 ? (
              report.behavioralQuesttions.map((item, index) => (
                <div key={index} className="report-item">
                  <h3>Question {index + 1}</h3>
                  <p><strong>Question:</strong> {item.questions}</p>
                  <p><strong>Intention:</strong> {item.intentions}</p>
                  <p><strong>Answer:</strong> {item.answers}</p>
                </div>
              ))
            ) : (
              <p>No behavioral questions available.</p>
            )}
          </div>
        )}

        {activeSection === "Skill Gap" && (
          <div className="report-card">
            {report.skillgap?.length > 0 ? (
              report.skillgap.map((item, index) => (
                <div key={index} className="report-item">
                  <p><strong>Skill:</strong> {item.skills}</p>
                </div>
              ))
            ) : (
              <p>No skill gaps available.</p>
            )}
          </div>
        )}

        {activeSection === "Preparation Plan" && (
          <div className="report-card">
            {report.preprationplan?.length > 0 ? (
              report.preprationplan.map((item, index) => (
                <div key={index} className="report-item">
                  <h3>Day {item.day}</h3>
                  <p><strong>Focus:</strong> {item.focus}</p>
                  <p><strong>Task:</strong> {item.task}</p>
                </div>
              ))
            ) : (
              <p>No preparation plan available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Report;
