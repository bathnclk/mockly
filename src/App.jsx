import "./index.css";

import Toolbar from "./components/Toolbar";
import Workspace from "./components/Workspace";
import StatsModal from "./components/StatsModal";
import ExamStartModal from "./components/ExamStartModal";
import FinishConfirmModal from "./components/FinishConfirmModal";
import { useState, useEffect } from "react";

function App() {
  const [examStatus, setExamStatus] = useState("setup");
  // setup | running | finished

  const [activeTool, setActiveTool] = useState("question");

  const [questions, setQuestions] = useState([]);

  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const [remainingSeconds, setRemainingSeconds] = useState(150 * 60);

  const [showStats, setShowStats] = useState(false);
  const [showExamStartModal, setShowExamStartModal] = useState(false);

  const [examMinutes, setExamMinutes] = useState(150);

  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);

  function startExam() {
    setRemainingSeconds(examMinutes * 60);

    setExamStatus("running");

    setActiveTool("pen");

    setActiveQuestionId(null);

    setShowExamStartModal(false);
  }

  useEffect(() => {
    if (examStatus !== "running") return;

    if (activeQuestionId === null) return;

    const interval = setInterval(() => {
      setQuestions((current) =>
        current.map((question) => {
          if (question.id !== activeQuestionId) {
            return question;
          }

          return {
            ...question,
            elapsedSeconds: question.elapsedSeconds + 1,
          };
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [examStatus, activeQuestionId]);

  useEffect(() => {
    if (examStatus !== "running") return;

    const interval = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examStatus]);

  return (
    <main className="app">
      <Toolbar
        examStatus={examStatus}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        setExamStatus={setExamStatus}
        setShowStats={setShowStats}
        setActiveQuestionId={setActiveQuestionId}
        remainingSeconds={remainingSeconds}
        onStartExam={() => setShowExamStartModal(true)}
        onFinishExam={() => setShowFinishConfirmModal(true)}
      />
      <Workspace
        examStatus={examStatus}
        activeTool={activeTool}
        questions={questions}
        setQuestions={setQuestions}
        activeQuestionId={activeQuestionId}
        setActiveQuestionId={setActiveQuestionId}
        activeTool={activeTool}
      />
      {showStats && (
        <StatsModal questions={questions} onClose={() => setShowStats(false)} />
      )}
      {showExamStartModal && (
        <ExamStartModal
          examMinutes={examMinutes}
          setExamMinutes={setExamMinutes}
          onCancel={() => setShowExamStartModal(false)}
          onStart={startExam}
        />
      )}
      {showFinishConfirmModal && (
        <FinishConfirmModal
          onCancel={() => setShowFinishConfirmModal(false)}
          onConfirm={() => {
            setShowFinishConfirmModal(false);
            setExamStatus("finished");
            setActiveQuestionId(null);
            setShowStats(true);
          }}
        />
      )}
    </main>
  );
}

export default App;
