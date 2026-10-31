import { Plan } from '../../shared/schemas.js';

export function generateIcsFile(plan: Plan): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlanPilot AI//Event Planning Assistant//EN',
    `X-WR-CALNAME:${plan.brief.title} Plan`,
  ];

  const eventDate = new Date(plan.brief.date).toISOString().replace(/[-:]/g, '').split('T')[0];

  for (const task of plan.timeline) {
    lines.push(
      'BEGIN:VEVENT',
      `SUMMARY:${task.title}`,
      `DESCRIPTION:Category: ${task.category}\\nPriority: ${task.priority}\\nNotes: ${task.notes || 'None'}`,
      `DTSTART;VALUE=DATE:${eventDate}`,
      `DTEND;VALUE=DATE:${eventDate}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcs(plan: Plan) {
  const icsContent = generateIcsFile(plan);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${plan.brief.title.toLowerCase().replace(/\s+/g, '_')}_timeline.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
