import { useEffect, useMemo, useState } from 'react';
import Countdown from './Countdown.jsx';
import ProgressBar from './ProgressBar.jsx';
import { getCalendarDaysLeft, getNextExam, getSubjectStats, getTopicStats } from '../utils/calculations.js';

export default function Dashboard({ subjects, dailyPlan, onAddPlanItem, onOpenSubject, onRemovePlanItem, onTogglePlanItem }) {
  const nextExam = getNextExam(subjects);
  const planItems = useMemo(
    () => dailyPlan.items.map((item) => resolvePlanItem(subjects, item)).filter(Boolean),
    [dailyPlan.items, subjects],
  );
  const completedPlanItems = planItems.filter((item) => item.done).length;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#1d2a24] bg-[#101511] p-5 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">Next Exam</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-100">
              {nextExam ? `NEXT: ${nextExam.name}` : 'No upcoming exams'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {nextExam ? `Exam date: ${formatDate(nextExam.examDate)}` : 'Subjects will appear here.'}
            </p>
          </div>
          {nextExam ? <Countdown examDate={nextExam.examDate} /> : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <PlanMetric label="Planned today" value={planItems.length} detail="items" />
        <PlanMetric label="Done today" value={completedPlanItems} detail="items" tone="sky" />
        <PlanMetric label="Remaining" value={Math.max(0, planItems.length - completedPlanItems)} detail="items" tone="amber" />
      </section>

      <section className="rounded-xl border border-[#1d2a24] bg-[#101511] p-5 shadow-soft">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Daily Plan</h2>
          <div className="text-sm font-medium text-slate-400">{formatDate(dailyPlan.date)}</div>
        </div>

        <AddPlanItemForm onAddPlanItem={onAddPlanItem} subjects={subjects} />

        <div className="mt-5 space-y-3">
          {planItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#29372f] p-5 text-sm text-slate-500">No plan items yet.</div>
          ) : (
            planItems.map((item) => (
              <PlanItem
                item={item}
                key={item.id}
                onOpenSubject={onOpenSubject}
                onRemovePlanItem={onRemovePlanItem}
                onTogglePlanItem={onTogglePlanItem}
              />
            ))
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Subjects</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} onOpenSubject={onOpenSubject} subject={subject} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AddPlanItemForm({ subjects, onAddPlanItem }) {
  const [mode, setMode] = useState('topic');
  const [subjectId, setSubjectId] = useState(() => subjects[0]?.id ?? '');
  const [topicId, setTopicId] = useState(() => subjects[0]?.topics[0]?.id ?? '');
  const [subtopicId, setSubtopicId] = useState(() => subjects[0]?.topics[0]?.subtopics[0]?.id ?? '');

  const selectedSubject = subjects.find((subject) => subject.id === subjectId);
  const selectedTopic = selectedSubject?.topics.find((topic) => topic.id === topicId);
  const canSubmit = Boolean(selectedSubject && selectedTopic && (mode === 'topic' || subtopicId));

  useEffect(() => {
    const nextSubjectId = subjects.some((subject) => subject.id === subjectId) ? subjectId : subjects[0]?.id ?? '';
    const nextSubject = subjects.find((subject) => subject.id === nextSubjectId);
    const nextTopicId = nextSubject?.topics.some((topic) => topic.id === topicId) ? topicId : nextSubject?.topics[0]?.id ?? '';
    const nextTopic = nextSubject?.topics.find((topic) => topic.id === nextTopicId);
    const nextSubtopicId =
      nextTopic?.subtopics.some((subtopic) => subtopic.id === subtopicId) ? subtopicId : nextTopic?.subtopics[0]?.id ?? '';

    if (nextSubjectId !== subjectId) setSubjectId(nextSubjectId);
    if (nextTopicId !== topicId) setTopicId(nextTopicId);
    if (nextSubtopicId !== subtopicId) setSubtopicId(nextSubtopicId);
  }, [subjectId, subjects, subtopicId, topicId]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    onAddPlanItem({
      type: mode,
      subjectId,
      topicId,
      subtopicId: mode === 'subtopic' ? subtopicId : undefined,
    });
  }

  return (
    <form className="mt-5 rounded-xl border border-[#1d2a24] bg-[#0c110e] p-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
          <div className="flex rounded-xl bg-[#17201b] p-1">
            {[
              ['topic', 'Topic'],
              ['subtopic', 'Subtopic'],
            ].map(([value, label]) => (
              <button
                className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === value ? 'bg-[#0b0f0d] text-teal-300 shadow-sm' : 'text-slate-400'}`}
                key={value}
                onClick={() => setMode(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <PlanSelect label="Subject" onChange={setSubjectId} value={subjectId}>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </PlanSelect>

        <PlanSelect label="Topic / chapter" onChange={setTopicId} value={topicId}>
          {(selectedSubject?.topics ?? []).map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </PlanSelect>

        <PlanSelect disabled={mode === 'topic'} label="Subtopic" onChange={setSubtopicId} value={subtopicId}>
          {(selectedTopic?.subtopics ?? []).map((subtopic) => (
            <option key={subtopic.id} value={subtopic.id}>
              {subtopic.name}
            </option>
          ))}
        </PlanSelect>

        <button
          className="rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[#06100c] hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          disabled={!canSubmit}
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}

function PlanSelect({ children, disabled = false, label, onChange, value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        className="w-full rounded-xl border border-[#29372f] bg-[#070908] px-3 py-2 text-sm text-slate-100 disabled:bg-[#101511] disabled:text-slate-500"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function PlanItem({ item, onOpenSubject, onRemovePlanItem, onTogglePlanItem }) {
  return (
    <div className="rounded-xl border border-[#1d2a24] bg-[#0c110e] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <label className="flex min-w-0 flex-1 items-start gap-3">
          <input
            checked={item.done}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-teal-700"
            disabled={item.type === 'topic' && item.total === 0}
            onChange={() => onTogglePlanItem(item)}
            type="checkbox"
          />
          <span className="min-w-0">
            <span className={`block font-medium ${item.done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{item.title}</span>
            <span className="mt-1 block text-sm text-slate-400">
              {item.subjectName} - {item.typeLabel}
            </span>
            <span className="mt-1 block text-sm text-slate-500">{item.detail}</span>
          </span>
        </label>

        <div className="flex gap-2">
          <button
            className="rounded-xl border border-[#29372f] px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
            onClick={() => onOpenSubject(item.subjectId)}
            type="button"
          >
            Open
          </button>
          <button
            className="rounded-xl border border-[#29372f] px-3 py-2 text-sm font-medium text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
            onClick={() => onRemovePlanItem(item.id)}
            type="button"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar size="sm" value={item.progress} />
      </div>
    </div>
  );
}

function SubjectCard({ subject, onOpenSubject }) {
  const stats = getSubjectStats(subject);
  const daysLeft = getCalendarDaysLeft(subject.examDate);

  return (
    <button
      className="rounded-xl border border-[#1d2a24] bg-[#101511] p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-teal-400/30 hover:shadow-lg"
      onClick={() => onOpenSubject(subject.id)}
      type="button"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{subject.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{formatDate(subject.examDate)}</p>
        </div>
        <Countdown compact examDate={subject.examDate} />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-300">{stats.progress}% complete</span>
          <span className="text-slate-500">
            {stats.completed} / {stats.total} subtopics done
          </span>
        </div>
        <ProgressBar value={stats.progress} />
      </div>

      <div className="mt-4 text-sm text-slate-400">{daysLeft} days left</div>
    </button>
  );
}

function resolvePlanItem(subjects, item) {
  const subject = subjects.find((currentSubject) => currentSubject.id === item.subjectId);
  const topic = subject?.topics.find((currentTopic) => currentTopic.id === item.topicId);
  if (!subject || !topic) return null;

  if (item.type === 'topic') {
    const stats = getTopicStats(topic);

    return {
      ...item,
      detail: `${stats.completed} / ${stats.total} subtopics done`,
      done: stats.total > 0 && stats.completed === stats.total,
      progress: stats.progress,
      subjectName: subject.name,
      title: topic.name,
      total: stats.total,
      typeLabel: 'Topic / chapter',
    };
  }

  const subtopic = topic.subtopics.find((currentSubtopic) => currentSubtopic.id === item.subtopicId);
  if (!subtopic) return null;

  return {
    ...item,
    detail: topic.name,
    done: subtopic.done,
    progress: subtopic.done ? 100 : 0,
    subjectName: subject.name,
    title: subtopic.name,
    typeLabel: 'Subtopic',
  };
}

function PlanMetric({ label, value, detail, tone = 'teal' }) {
  const toneClass = {
    teal: 'text-teal-200 bg-teal-400/10',
    sky: 'text-sky-200 bg-sky-400/10',
    amber: 'text-amber-200 bg-amber-400/10',
  }[tone];

  return (
    <div className="rounded-xl border border-[#1d2a24] bg-[#101511] p-5 shadow-soft">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`rounded-xl px-3 py-1 text-3xl font-semibold ${toneClass}`}>{value}</span>
        <span className="text-sm text-slate-500">{detail}</span>
      </div>
    </div>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}
