import { Plan } from '../../shared/schemas.js';

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.substring(0, 75));
  remaining = remaining.substring(75);
  while (remaining.length > 0) {
    parts.push(' ' + remaining.substring(0, 74));
    remaining = remaining.substring(74);
  }
  return parts.join('\r\n');
}

export function generateCalendarIcs(plan: Plan): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlanPilot AI//Event Planning Engine//EN',
    `X-WR-CALNAME:${plan.brief.title} Milestones`,
  ];

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  for (const task of plan.timeline) {
    const rawDate = task.dueDate || plan.brief.date;
    const cleanDate = rawDate.replace(/[-:]/g, '');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${task.id}@planpilot.ai`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      `SUMMARY:${task.title}`,
      `DESCRIPTION:Priority: ${task.priority.toUpperCase()}\\nCategory: ${task.category}\\nPhase: ${task.phase}\\nNotes: ${task.notes || 'None'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n');
}

export function triggerIcsDownload(plan: Plan) {
  const ics = generateCalendarIcs(plan);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.brief.title.toLowerCase().replace(/\s+/g, '_')}_milestones.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
