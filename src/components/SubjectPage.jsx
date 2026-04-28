import { useMemo, useState } from 'react';
import ProgressBar from './ProgressBar.jsx';
import { createId } from '../utils/id.js';
import { getCalendarDaysLeft, getSubjectStats, getTopicStats } from '../utils/calculations.js';

export default function SubjectPage({
  selectedSubjectId,
  subjects,
  onAddSubject,
  onAddSubtopic,
  onAddTopic,
  onDeleteSubject,
  onSelectSubject,
  onToggleSubtopic,
}) {
  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === selectedSubjectId) ?? subjects[0] ?? null,
    [selectedSubjectId, subjects],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <section className="space-y-4">
        <AddSubjectForm onAddSubject={onAddSubject} />
        <SubjectList onDeleteSubject={onDeleteSubject} onSelectSubject={onSelectSubject} selectedSubject={selectedSubject} subjects={subjects} />
      </section>

      <section>
        {selectedSubject ? (
          <SubjectDetail onAddSubtopic={onAddSubtopic} onAddTopic={onAddTopic} onToggleSubtopic={onToggleSubtopic} subject={selectedSubject} />
        ) : (
          <div className="rounded-xl border border-[#1d2a24] bg-[#101511] p-8 text-center shadow-soft">
            <h1 className="text-2xl font-semibold text-slate-100">Add your first subject</h1>
          </div>
        )}
      </section>
    </div>
  );
}

function AddSubjectForm({ onAddSubject }) {
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !examDate) return;
    onAddSubject({
      id: createId('subject'),
      name: name.trim(),
      examDate,
      topics: [],
    });
    setName('');
    setExamDate('');
  }

  return (
    <form className="rounded-xl border border-[#1d2a24] bg-[#101511] p-5 shadow-soft" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold text-slate-100">New Subject</h2>
      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-xl border border-[#29372f] bg-[#070908] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          onChange={(event) => setName(event.target.value)}
          placeholder="Subject name"
          type="text"
          value={name}
        />
        <input
          className="w-full rounded-xl border border-[#29372f] bg-[#070908] px-3 py-2 text-sm text-slate-100"
          onChange={(event) => setExamDate(event.target.value)}
          type="date"
          value={examDate}
        />
        <button className="w-full rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[#06100c] hover:bg-teal-300" type="submit">
          Add subject
        </button>
      </div>
    </form>
  );
}

function SubjectList({ subjects, selectedSubject, onSelectSubject, onDeleteSubject }) {
  return (
    <div className="rounded-xl border border-[#1d2a24] bg-[#101511] p-3 shadow-soft">
      <div className="px-2 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Subjects</div>
      <div className="space-y-2">
        {subjects.map((subject) => {
          const isActive = selectedSubject?.id === subject.id;
          const stats = getSubjectStats(subject);

          return (
            <div className={`rounded-xl border p-3 ${isActive ? 'border-teal-400/40 bg-teal-400/10' : 'border-[#1d2a24] bg-[#0c110e]'}`} key={subject.id}>
              <button className="w-full text-left" onClick={() => onSelectSubject(subject.id)} type="button">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-slate-100">{subject.name}</div>
                    <div className="text-sm text-slate-500">{getCalendarDaysLeft(subject.examDate)} days left</div>
                  </div>
                  <span className="text-sm font-semibold text-teal-300">{stats.progress}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar size="sm" value={stats.progress} />
                </div>
              </button>
              <button
                className="mt-3 text-xs font-medium text-slate-500 hover:text-rose-300"
                onClick={() => onDeleteSubject(subject.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubjectDetail({ subject, onAddTopic, onAddSubtopic, onToggleSubtopic }) {
  const stats = getSubjectStats(subject);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#1d2a24] bg-[#101511] p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">{getCalendarDaysLeft(subject.examDate)} days left</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-100">{subject.name}</h1>
            <p className="mt-2 text-sm text-slate-400">
              {stats.completed} of {stats.total} subtopics complete
            </p>
          </div>
          <div className="w-full lg:w-80">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-300">Subject progress</span>
              <span className="text-slate-500">{stats.progress}%</span>
            </div>
            <ProgressBar value={stats.progress} />
          </div>
        </div>
      </div>

      <AddTopicForm onAddTopic={(name) => onAddTopic(subject.id, name)} />

      <div className="space-y-4">
        {subject.topics.map((topic) => (
          <TopicPanel
            key={topic.id}
            onAddSubtopic={(name) => onAddSubtopic(subject.id, topic.id, name)}
            onToggleSubtopic={(subtopicId) => onToggleSubtopic(subject.id, topic.id, subtopicId)}
            topic={topic}
          />
        ))}
      </div>
    </div>
  );
}

function AddTopicForm({ onAddTopic }) {
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onAddTopic(name.trim());
    setName('');
  }

  return (
    <form className="flex flex-col gap-3 rounded-xl border border-[#1d2a24] bg-[#101511] p-4 shadow-soft sm:flex-row" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-xl border border-[#29372f] bg-[#070908] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        onChange={(event) => setName(event.target.value)}
        placeholder="New topic"
        type="text"
        value={name}
      />
      <button className="rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[#06100c] hover:bg-teal-300" type="submit">
        Add topic
      </button>
    </form>
  );
}

function TopicPanel({ topic, onToggleSubtopic, onAddSubtopic }) {
  const [isOpen, setIsOpen] = useState(true);
  const [subtopicName, setSubtopicName] = useState('');
  const stats = getTopicStats(topic);

  function handleSubmit(event) {
    event.preventDefault();
    if (!subtopicName.trim()) return;
    onAddSubtopic(subtopicName.trim());
    setSubtopicName('');
  }

  return (
    <article className="rounded-xl border border-[#1d2a24] bg-[#101511] shadow-soft">
      <button className="w-full p-5 text-left" onClick={() => setIsOpen((current) => !current)} type="button">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{topic.name}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {stats.completed} / {stats.total} subtopics done
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-teal-300">{stats.progress}%</span>
            <span className="rounded-lg bg-[#17201b] px-2 py-1 text-sm text-slate-400">{isOpen ? 'Hide' : 'Show'}</span>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={stats.progress} />
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-[#1d2a24] px-5 pb-5 pt-4">
          <div className="space-y-2">
            {topic.subtopics.map((subtopic) => (
              <label
                className="flex items-center gap-3 rounded-xl border border-[#1d2a24] bg-[#0c110e] px-3 py-3 text-sm text-slate-300"
                key={subtopic.id}
              >
                <input
                  checked={subtopic.done}
                  className="h-4 w-4 rounded border-slate-300 accent-teal-700"
                  onChange={() => onToggleSubtopic(subtopic.id)}
                  type="checkbox"
                />
                <span className={subtopic.done ? 'text-slate-500 line-through' : ''}>{subtopic.name}</span>
              </label>
            ))}
          </div>

          <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <input
              className="min-w-0 flex-1 rounded-xl border border-[#29372f] bg-[#070908] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              onChange={(event) => setSubtopicName(event.target.value)}
              placeholder="New subtopic"
              type="text"
              value={subtopicName}
            />
            <button className="rounded-xl border border-[#29372f] px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5" type="submit">
              Add subtopic
            </button>
          </form>
        </div>
      ) : null}
    </article>
  );
}
