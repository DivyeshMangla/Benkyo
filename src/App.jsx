import { useEffect, useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import Dashboard from './components/Dashboard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import SubjectPage from './components/SubjectPage.jsx';
import { createId } from './utils/id.js';

const STORAGE_KEY = 'benkyo-data-v1';
const DAILY_PLAN_KEY = 'benkyo-daily-plan-v1';

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadSubjects() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return normalizeSubjects(JSON.parse(stored).subjects);
  } catch {
    return [];
  }
}

function normalizeSubjects(subjects) {
  if (!Array.isArray(subjects)) return [];

  return subjects
    .filter((subject) => subject && typeof subject === 'object')
    .map((subject) => ({
      id: subject.id || createId('subject'),
      name: subject.name || 'Untitled subject',
      examDate: subject.examDate || getTodayKey(),
      topics: normalizeTopics(subject.topics),
    }));
}

function normalizeTopics(topics) {
  if (!Array.isArray(topics)) return [];

  return topics
    .filter((topic) => topic && typeof topic === 'object')
    .map((topic) => ({
      id: topic.id || createId('topic'),
      name: topic.name || 'Untitled topic',
      subtopics: normalizeSubtopics(topic.subtopics),
    }));
}

function normalizeSubtopics(subtopics) {
  if (!Array.isArray(subtopics)) return [];

  return subtopics
    .filter((subtopic) => subtopic && typeof subtopic === 'object')
    .map((subtopic) => ({
      id: subtopic.id || createId('subtopic'),
      name: subtopic.name || 'Untitled subtopic',
      done: Boolean(subtopic.done),
    }));
}

function loadDailyPlan() {
  try {
    const stored = window.localStorage.getItem(DAILY_PLAN_KEY);
    return normalizeDailyPlan(stored ? JSON.parse(stored) : {}, getTodayKey());
  } catch {
    return createEmptyDailyPlan();
  }
}

function createEmptyDailyPlan(date = getTodayKey()) {
  return { date, items: [] };
}

function normalizeDailyPlan(dailyPlan, todayKey) {
  if (!dailyPlan || typeof dailyPlan !== 'object' || Array.isArray(dailyPlan) || dailyPlan.date !== todayKey) {
    return createEmptyDailyPlan(todayKey);
  }

  return {
    date: todayKey,
    items: Array.isArray(dailyPlan.items)
      ? dailyPlan.items
          .filter((item) => item && typeof item === 'object' && ['topic', 'subtopic'].includes(item.type))
          .map((item) => ({
            id: item.id || createId('plan'),
            type: item.type,
            subjectId: item.subjectId,
            topicId: item.topicId,
            subtopicId: item.type === 'subtopic' ? item.subtopicId : undefined,
          }))
      : [],
  };
}

export default function App() {
  const [subjects, setSubjects] = useState(loadSubjects);
  const [dailyPlan, setDailyPlan] = useState(loadDailyPlan);
  const [todayKey, setTodayKey] = useState(getTodayKey);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => subjects[0]?.id ?? null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isLoadingLeaving, setIsLoadingLeaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ subjects }));
  }, [subjects]);

  useEffect(() => {
    window.localStorage.setItem(DAILY_PLAN_KEY, JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  useEffect(() => {
    const timer = window.setInterval(() => setTodayKey(getTodayKey()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (dailyPlan.date !== todayKey) {
      setDailyPlan(createEmptyDailyPlan(todayKey));
    }
  }, [dailyPlan.date, todayKey]);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setIsLoadingLeaving(true), 3600);
    const removeTimer = window.setTimeout(() => setShowLoadingScreen(false), 4150);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  function handleOpenSubject(subjectId) {
    setSelectedSubjectId(subjectId);
    setActiveView('subjects');
  }

  function handleAddSubject(subject) {
    setSubjects((current) => [...current, subject]);
    setSelectedSubjectId(subject.id);
    setActiveView('subjects');
  }

  function handleDeleteSubject(subjectId) {
    setSubjects((current) => current.filter((subject) => subject.id !== subjectId));
    setDailyPlan((current) => ({
      ...current,
      items: current.items.filter((item) => item.subjectId !== subjectId),
    }));
    setSelectedSubjectId((current) => (current === subjectId ? null : current));
  }

  function handleAddTopic(subjectId, topicName) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: [
                ...subject.topics,
                {
                  id: createId('topic'),
                  name: topicName,
                  subtopics: [],
                },
              ],
            }
          : subject,
      ),
    );
  }

  function handleAddSubtopic(subjectId, topicId, subtopicName) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic) =>
                topic.id === topicId
                  ? {
                      ...topic,
                      subtopics: [...topic.subtopics, { id: createId('subtopic'), name: subtopicName, done: false }],
                    }
                  : topic,
              ),
            }
          : subject,
      ),
    );
  }

  function handleToggleSubtopic(subjectId, topicId, subtopicId) {
    const currentSubtopic = subjects
      .find((subject) => subject.id === subjectId)
      ?.topics.find((topic) => topic.id === topicId)
      ?.subtopics.find((subtopic) => subtopic.id === subtopicId);
    const nextDone = currentSubtopic ? !currentSubtopic.done : false;

    setSubjects((current) =>
      current.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic) =>
                topic.id === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((subtopic) => {
                        if (subtopic.id !== subtopicId) return subtopic;
                        return { ...subtopic, done: nextDone };
                      }),
                    }
                  : topic,
              ),
            }
          : subject,
      ),
    );

  }

  function handleAddPlanItem(item) {
    setDailyPlan((current) => {
      const activePlan = current.date === todayKey ? current : createEmptyDailyPlan(todayKey);
      const exists = activePlan.items.some(
        (planItem) =>
          planItem.type === item.type &&
          planItem.subjectId === item.subjectId &&
          planItem.topicId === item.topicId &&
          planItem.subtopicId === item.subtopicId,
      );

      if (exists) return activePlan;

      return {
        ...activePlan,
        items: [...activePlan.items, { id: createId('plan'), ...item }],
      };
    });
  }

  function handleReset() {
    setShowResetConfirm(true);
  }

  function handleConfirmReset() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(DAILY_PLAN_KEY);
    setSubjects([]);
    setDailyPlan(createEmptyDailyPlan());
    setSelectedSubjectId(null);
    setActiveView('dashboard');
    setShowResetConfirm(false);
  }

  function handleRemovePlanItem(planItemId) {
    setDailyPlan((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== planItemId),
    }));
  }

  function handleTogglePlanItem(planItem) {
    const subject = subjects.find((currentSubject) => currentSubject.id === planItem.subjectId);
    const topic = subject?.topics.find((currentTopic) => currentTopic.id === planItem.topicId);
    if (!topic) return;

    const isDone =
      planItem.type === 'topic'
        ? topic.subtopics.length > 0 && topic.subtopics.every((subtopic) => subtopic.done)
        : topic.subtopics.find((subtopic) => subtopic.id === planItem.subtopicId)?.done ?? false;
    const nextDone = !isDone;

    setSubjects((current) =>
      current.map((currentSubject) =>
        currentSubject.id === planItem.subjectId
          ? {
              ...currentSubject,
              topics: currentSubject.topics.map((currentTopic) =>
                currentTopic.id === planItem.topicId
                  ? {
                      ...currentTopic,
                      subtopics: currentTopic.subtopics.map((subtopic) =>
                        planItem.type === 'topic' || subtopic.id === planItem.subtopicId
                          ? { ...subtopic, done: nextDone }
                          : subtopic,
                      ),
                    }
                  : currentTopic,
              ),
            }
          : currentSubject,
      ),
    );
  }

  return (
    <>
      {showLoadingScreen ? <LoadingScreen isLeaving={isLoadingLeaving} /> : null}
      {showResetConfirm ? (
        <ConfirmDialog
          confirmLabel="Reset all data"
          message="This will permanently delete all subjects, topics, and your daily plan. This cannot be undone."
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={handleConfirmReset}
          title="Reset all data?"
        />
      ) : null}
      <div className="min-h-screen bg-[#070908] text-slate-100 md:flex">
        <Sidebar activeView={activeView} onNavigate={setActiveView} onReset={handleReset} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {activeView === 'dashboard' ? (
              <Dashboard
                dailyPlan={dailyPlan}
                onAddPlanItem={handleAddPlanItem}
                onOpenSubject={handleOpenSubject}
                onRemovePlanItem={handleRemovePlanItem}
                onTogglePlanItem={handleTogglePlanItem}
                subjects={subjects}
              />
            ) : (
              <SubjectPage
                onAddSubject={handleAddSubject}
                onAddSubtopic={handleAddSubtopic}
                onAddTopic={handleAddTopic}
                onDeleteSubject={handleDeleteSubject}
                onSelectSubject={setSelectedSubjectId}
                onToggleSubtopic={handleToggleSubtopic}
                selectedSubjectId={selectedSubjectId}
                subjects={subjects}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
