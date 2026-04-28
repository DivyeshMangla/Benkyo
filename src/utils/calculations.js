const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseExamDate(examDate) {
  if (!examDate) return null;
  const [year, month, day] = examDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

export function getCountdownParts(examDate, now = new Date()) {
  const target = parseExamDate(examDate);
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  const distance = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(distance / MS_PER_DAY);
  const hours = Math.floor((distance % MS_PER_DAY) / (60 * 60 * 1000));
  const minutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((distance % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds, isPast: distance === 0 };
}

export function getCalendarDaysLeft(examDate, now = new Date()) {
  const target = parseExamDate(examDate);
  if (!target) return 0;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.max(0, Math.floor((examDay - today) / MS_PER_DAY) + 1);
}

export function getNextExam(subjects) {
  const now = new Date();
  return subjects
    .filter((subject) => parseExamDate(subject.examDate)?.getTime() >= now.getTime())
    .sort((a, b) => parseExamDate(a.examDate) - parseExamDate(b.examDate))[0] ?? null;
}

export function getTopicStats(topic) {
  const total = topic.subtopics.length;
  const completed = topic.subtopics.filter((subtopic) => subtopic.done).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, remaining: total - completed, progress };
}

export function getSubjectStats(subject) {
  const topicStats = subject.topics.map(getTopicStats);
  const total = topicStats.reduce((sum, topic) => sum + topic.total, 0);
  const completed = topicStats.reduce((sum, topic) => sum + topic.completed, 0);
  const remaining = Math.max(0, total - completed);
  const progress =
    topicStats.length === 0
      ? 0
      : Math.round(topicStats.reduce((sum, topic) => sum + topic.progress, 0) / topicStats.length);

  return { total, completed, remaining, progress };
}
