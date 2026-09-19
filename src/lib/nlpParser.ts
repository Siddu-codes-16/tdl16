import { Priority, SmartParseResult } from '@/types/todo';

export function parseNaturalLanguage(input: string): SmartParseResult {
  let text = input.trim();
  const tags: string[] = [];
  let priority: Priority | undefined = undefined;
  let dueDate: string | null = null;
  let dueTime: string | null = null;
  let category: string | undefined = undefined;
  let estimatedMinutes: number | null = null;

  // 1. Extract #tags
  const tagRegex = /#([\w-]+)/g;
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    tags.push(match[1].toLowerCase());
  }
  text = text.replace(tagRegex, '').trim();

  // 2. Extract @category
  const catRegex = /@([\w-]+)/i;
  const catMatch = text.match(catRegex);
  if (catMatch) {
    category = catMatch[1].charAt(0).toUpperCase() + catMatch[1].slice(1).toLowerCase();
    text = text.replace(catRegex, '').trim();
  }

  // 3. Extract Duration: ~30m, 45min, 1h, 1.5h, 2 hours
  const durationRegex = /(?:~|for\s+)?(\d+(?:\.\d+)?)\s*(m|min|mins|minutes|h|hr|hrs|hours)\b/i;
  const durMatch = text.match(durationRegex);
  if (durMatch) {
    const val = parseFloat(durMatch[1]);
    const unit = durMatch[2].toLowerCase();
    if (unit.startsWith('h')) {
      estimatedMinutes = Math.round(val * 60);
    } else {
      estimatedMinutes = Math.round(val);
    }
    text = text.replace(durMatch[0], '').trim();
  }

  // 4. Extract Priority
  const urgentRegex = /\b(urgent|critical|p0|asap)\b/i;
  const highRegex = /\b(high\s+priority|priority\s+high|p1|important)\b/i;
  const medRegex = /\b(medium\s+priority|med\s+priority|priority\s+med|p2|normal)\b/i;
  const lowRegex = /\b(low\s+priority|priority\s+low|p3)\b/i;

  if (urgentRegex.test(text)) {
    priority = 'urgent';
    text = text.replace(urgentRegex, '').trim();
  } else if (highRegex.test(text)) {
    priority = 'high';
    text = text.replace(highRegex, '').trim();
  } else if (medRegex.test(text)) {
    priority = 'medium';
    text = text.replace(medRegex, '').trim();
  } else if (lowRegex.test(text)) {
    priority = 'low';
    text = text.replace(lowRegex, '').trim();
  }

  // 5. Extract Time: 5pm, 17:30, 9:00 am, noon, midnight
  const timeRegex = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b(?:at\s+)?(noon|midnight)\b|\bat\s+(\d{1,2}):(\d{2})\b/i;
  const timeMatch = text.match(timeRegex);
  if (timeMatch) {
    if (timeMatch[4]) {
      dueTime = timeMatch[4].toLowerCase() === 'noon' ? '12:00' : '00:00';
    } else if (timeMatch[5] && timeMatch[6]) {
      const h = parseInt(timeMatch[5], 10);
      const m = parseInt(timeMatch[6], 10);
      dueTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    } else if (timeMatch[1]) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = timeMatch[3]?.toLowerCase();
      if (meridiem === 'pm' && h < 12) h += 12;
      if (meridiem === 'am' && h === 12) h = 0;
      dueTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    text = text.replace(timeMatch[0], '').trim();
  }

  // 6. Extract Relative Dates
  const now = new Date();
  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  const todayRegex = /\b(today|tonight)\b/i;
  const tomorrowRegex = /\b(tomorrow|tmrw)\b/i;
  const inDaysRegex = /\bin\s+(\d+)\s+(day|days|d)\b/i;
  const inWeeksRegex = /\bin\s+(\d+)\s+(week|weeks|w)\b/i;
  const dayNamesRegex = /\b(?:on\s+|next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i;

  if (todayRegex.test(text)) {
    dueDate = formatYMD(now);
    text = text.replace(todayRegex, '').trim();
  } else if (tomorrowRegex.test(text)) {
    const tmrw = new Date(now);
    tmrw.setDate(tmrw.getDate() + 1);
    dueDate = formatYMD(tmrw);
    text = text.replace(tomorrowRegex, '').trim();
  } else if (inDaysRegex.test(text)) {
    const dMatch = text.match(inDaysRegex);
    if (dMatch) {
      const days = parseInt(dMatch[1], 10);
      const target = new Date(now);
      target.setDate(target.getDate() + days);
      dueDate = formatYMD(target);
      text = text.replace(inDaysRegex, '').trim();
    }
  } else if (inWeeksRegex.test(text)) {
    const wMatch = text.match(inWeeksRegex);
    if (wMatch) {
      const weeks = parseInt(wMatch[1], 10);
      const target = new Date(now);
      target.setDate(target.getDate() + weeks * 7);
      dueDate = formatYMD(target);
      text = text.replace(inWeeksRegex, '').trim();
    }
  } else if (dayNamesRegex.test(text)) {
    const dnMatch = text.match(dayNamesRegex);
    if (dnMatch) {
      const daysMap: Record<string, number> = {
        sun: 0, sunday: 0,
        mon: 1, monday: 1,
        tue: 2, tuesday: 2,
        wed: 3, wednesday: 3,
        thu: 4, thursday: 4,
        fri: 5, friday: 5,
        sat: 6, saturday: 6,
      };
      const targetDay = daysMap[dnMatch[1].toLowerCase()];
      if (targetDay !== undefined) {
        const currentDay = now.getDay();
        let diff = targetDay - currentDay;
        if (diff <= 0) diff += 7; // Next occurrence
        const target = new Date(now);
        target.setDate(target.getDate() + diff);
        dueDate = formatYMD(target);
      }
      text = text.replace(dayNamesRegex, '').trim();
    }
  }

  // Clean trailing "on", "at", "by", commas
  text = text.replace(/\b(on|at|by|due)\s*$/i, '').trim();
  text = text.replace(/^[,\s-]+|[,\s-]+$/g, '').trim();

  return {
    title: text || input,
    dueDate,
    dueTime,
    priority,
    category,
    tags,
    estimatedMinutes,
  };
}
