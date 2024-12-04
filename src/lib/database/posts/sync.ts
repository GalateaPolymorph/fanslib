import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ContentSchedule } from "../content-schedules/type";
import { updateContentSchedule } from "../content-schedules/update";
import { createPost } from "./create";
import { deletePost } from "./delete";
import { getPostsBySchedule } from "./fetch";
import { RawPost } from "./type";
import { updatePost } from "./update";

const SCHEDULE_HORIZON_MONTHS = 3; // Generate posts for next 3 months

interface ScheduleDate {
  date: Date;
  count: number; // Number of posts for this date
}

const distributeTimesForDate = (date: Date, count: number, preferredTimes?: string[]): Date[] => {
  // If no preferred times, distribute evenly throughout the day
  if (!preferredTimes?.length) {
    const times: Date[] = [];
    for (let i = 0; i < count; i++) {
      const hour = Math.floor((24 / (count + 1)) * (i + 1));
      const newDate = new Date(date);
      newDate.setHours(hour, 0, 0, 0);
      times.push(newDate);
    }
    return times;
  }

  // Use preferred times, cycling through them if we need more times than provided
  return Array.from({ length: count }, (_, i) => {
    const timeStr = preferredTimes[i % preferredTimes.length];
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }).sort((a, b) => a.getTime() - b.getTime());
};

const generateScheduleDates = (
  schedule: ContentSchedule,
  startDate: Date = new Date()
): ScheduleDate[] => {
  const endDate = addMonths(startDate, SCHEDULE_HORIZON_MONTHS);

  switch (schedule.type) {
    case "daily": {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const postsPerDay = schedule.postsPerTimeframe || 1;
      return days.map((date) => ({ date, count: postsPerDay }));
    }

    case "weekly": {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
      // Default to Sunday if no preferred days specified
      const preferredDays = schedule.preferredDays?.length ? schedule.preferredDays : [0];
      const dates: ScheduleDate[] = [];

      weeks.forEach((week) => {
        preferredDays.forEach((day) => {
          const date = addDays(startOfWeek(week), day);
          if (date <= endDate) {
            dates.push({ date, count: 1 }); // Each preferred day gets one post by default
          }
        });
      });

      const postsPerWeek = schedule.postsPerTimeframe || preferredDays.length;
      return dates.slice(0, postsPerWeek * weeks.length);
    }

    case "monthly": {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      // Default to first day if no preferred days specified
      const preferredDays = schedule.preferredDays?.length ? schedule.preferredDays : [1];
      const dates: ScheduleDate[] = [];

      months.forEach((month) => {
        preferredDays.forEach((day) => {
          const date = addDays(startOfMonth(month), day - 1); // day is 1-based
          if (date <= endOfMonth(month) && date <= endDate) {
            dates.push({ date, count: 1 }); // Each preferred day gets one post by default
          }
        });
      });

      const postsPerMonth = schedule.postsPerTimeframe || preferredDays.length;
      return dates.slice(0, postsPerMonth * months.length);
    }

    default:
      return [];
  }
};

export const syncSchedulePosts = async (schedule: ContentSchedule) => {
  // 1. Get all existing posts for this schedule in chronological order
  const existingPosts = (await getPostsBySchedule(schedule.id)).sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  // 2. Generate all schedule dates and times
  const scheduleDates = generateScheduleDates(schedule);
  const allScheduledDateTimes: Date[] = [];

  // Generate all date/time combinations
  scheduleDates.forEach(({ date, count }) => {
    const times = distributeTimesForDate(date, count, schedule.preferredTimes);
    allScheduledDateTimes.push(...times);
  });

  // Sort all date/times chronologically
  allScheduledDateTimes.sort((a, b) => a.getTime() - b.getTime());

  const operations: (() => Promise<RawPost | void>)[] = [];

  // 3. Redistribute existing posts to new schedule slots
  const usedPostIds = new Set<string>();
  allScheduledDateTimes.forEach((dateTime, index) => {
    const existingPost = existingPosts[index];

    if (existingPost) {
      // Update existing post with new schedule time
      usedPostIds.add(existingPost.id);
      operations.push(() =>
        updatePost(existingPost.id, {
          scheduleId: schedule.id,
          channelId: schedule.channelId,
          categorySlug: schedule.categorySlug,
          scheduledDate: dateTime.toISOString(),
        })
      );
    } else {
      // Create new post for remaining slots
      operations.push(() =>
        createPost({
          scheduleId: schedule.id,
          channelId: schedule.channelId,
          categorySlug: schedule.categorySlug,
          caption: "",
          scheduledDate: dateTime.toISOString(),
          status: "planned",
          mediaIds: [],
        })
      );
    }
  });

  // 4. Delete any remaining posts that couldn't be scheduled
  existingPosts.forEach((post) => {
    if (!usedPostIds.has(post.id)) {
      operations.push(async () => {
        await deletePost(post.id);
      });
    }
  });

  // Execute all operations
  await Promise.all(operations.map((op) => op()));

  // Update last synced timestamp
  await updateContentSchedule(schedule.id, {
    lastSynced: new Date().toISOString(),
  });
};
