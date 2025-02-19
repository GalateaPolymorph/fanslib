import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  format,
  isSameMinute,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Tier } from "src/features/tiers/entity";
import { ContentSchedule } from "../../../features/content-schedules/entity";
import { Post } from "../../../features/posts/entity";
const SCHEDULE_HORIZON_MONTHS = 3; // Generate posts for next 3 months

export type VirtualPost = Omit<Post, "id" | "createdAt" | "updatedAt" | "postMedia"> & {
  isVirtual: true;
  scheduleId: string;
  virtualId: string;
  postMedia: VirtualPostMedia[];
};

export type VirtualPostMedia = {
  media: {
    tier?: Tier;
    tierId?: number;
  };
};

export const isVirtualPost = (post: Post | VirtualPost): post is VirtualPost => {
  return "isVirtual" in post && post.isVirtual === true;
};

const generateScheduleDates = (schedule: ContentSchedule, startDate: Date = new Date()): Date[] => {
  const endDate = addMonths(startDate, SCHEDULE_HORIZON_MONTHS);

  switch (schedule.type) {
    case "daily": {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const postsPerDay = schedule.postsPerTimeframe || 1;

      const dates = days.flatMap((day) => {
        return new Array(postsPerDay).fill(0).map((_, j) => {
          const date = new Date(day);
          const time = schedule.preferredTimes.at(j % schedule.preferredTimes.length);
          date.setHours(Number(time?.split(":")[0]) || 12);
          date.setMinutes(Number(time?.split(":")[1]) || 0);
          return date;
        });
      });

      return dates;
    }

    case "weekly": {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
      const postsPerWeek = schedule.postsPerTimeframe || 1;

      const dates = weeks.flatMap((week) => {
        return new Array(postsPerWeek).fill(0).map((_, i) => {
          const date = addDays(
            startOfWeek(week),
            parseInt(schedule.preferredDays.at(i % schedule.preferredDays.length))
          );
          const time = schedule.preferredTimes.at(i % schedule.preferredTimes.length);
          date.setHours(Number(time?.split(":")[0]) || 12);
          date.setMinutes(Number(time?.split(":")[1]) || 0);
          return date;
        });
      });

      return dates;
    }

    case "monthly": {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      // Default to first day if no preferred days specified
      const preferredDays = schedule.preferredDays?.length ? schedule.preferredDays : [1];
      const dates = [];

      months.forEach((month) => {
        preferredDays.forEach((day) => {
          const date = addDays(startOfMonth(month), day - 1); // day is 1-based
          if (date <= endOfMonth(month) && date <= endDate) {
            dates.push(date); // Each preferred day gets one post by default
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

export const generateVirtualPosts = (
  schedules: ContentSchedule[],
  existingPosts: Post[] = [],
  currentTime: Date = new Date()
): VirtualPost[] => {
  return schedules.flatMap((schedule) => {
    const dates = generateScheduleDates(schedule, currentTime);

    // filter out posts that already exist for the schedule on this date
    const filteredDates = dates.filter((date) => {
      return !existingPosts.some((post) => {
        const postDate = new Date(post.date);
        return isSameMinute(postDate, date) && schedule.channelId === post.channelId;
      });
    });

    return filteredDates.map((scheduleDate, index) => ({
      isVirtual: true as const,
      virtualId: `${schedule.id}-${index}`,
      scheduleId: schedule.id,
      channel: schedule.channel,
      channelId: schedule.channelId,
      category: schedule.category,
      categoryId: schedule.categoryId,
      caption: "",
      date: format(scheduleDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      status: "draft" as const,
      postMedia: [
        {
          media: {
            tier: schedule.tier,
            tierId: schedule.tierId,
          },
        },
      ],
    }));
  });
};
