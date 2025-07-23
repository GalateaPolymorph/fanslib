import type { SubredditPostingTime } from "../channels/api-type";
import { Subreddit } from "../channels/subreddit";
import { Post } from "../posts/entity";

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

const hasConflict = (targetDate: Date, existingPosts: Post[], minSpacingMinutes = 5): boolean => {
  return existingPosts.some((post) => {
    const postDate = new Date(post.date);
    const timeDiff = Math.abs(targetDate.getTime() - postDate.getTime());
    return timeDiff < minSpacingMinutes * 60000;
  });
};

const getSearchStartDate = (now: Date): Date => {
  const searchStartDate = new Date(now);
  searchStartDate.setMinutes(0, 0, 0);
  searchStartDate.setHours(searchStartDate.getHours() + 1);
  return searchStartDate;
};

const roundToNextHour = (date: Date): Date => {
  const rounded = new Date(date);
  rounded.setMinutes(0, 0, 0);
  if (date.getMinutes() > 0) {
    rounded.setHours(rounded.getHours() + 1);
  }
  return rounded;
};

const calculateMinAllowedPostTime = (
  searchStartDate: Date,
  subreddit: Subreddit,
  subredditPosts: Post[]
): Date => {
  const minTimeBetweenPosts = subreddit.maxPostFrequencyHours || 0;

  if (minTimeBetweenPosts === 0 || subredditPosts.length === 0) {
    return new Date(searchStartDate);
  }

  const lastPost = subredditPosts
    .map((p) => new Date(p.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const minNextPostTime = addMinutes(lastPost, minTimeBetweenPosts * 60);

  return minNextPostTime > searchStartDate
    ? roundToNextHour(minNextPostTime)
    : new Date(searchStartDate);
};

const createDateForDay = (baseDate: Date, dayOffset: number): Date => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + dayOffset);
  return date;
};

const createCandidateDate = (baseDate: Date, hour: number): Date => {
  const date = new Date(baseDate);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const isValidTimeSlot = (
  candidateDate: Date,
  now: Date,
  minAllowedPostTime: Date,
  channelPosts: Post[]
): boolean => {
  return (
    candidateDate > now &&
    candidateDate >= minAllowedPostTime &&
    !hasConflict(candidateDate, channelPosts, 5)
  );
};

const getValidTimeSlotsForDay = (
  dayDate: Date,
  postingTimes: SubredditPostingTime[],
  now: Date,
  minAllowedPostTime: Date,
  channelPosts: Post[]
): Array<{ date: Date; score: number }> => {
  const dayOfWeek = dayDate.getDay();

  // Filter posting times for the specific day
  const dayPostingTimes = postingTimes.filter((pt) => pt.day === dayOfWeek);

  // If no data for this day, return empty array
  if (dayPostingTimes.length === 0) {
    return [];
  }

  return dayPostingTimes
    .map(({ hour, score }) => ({
      date: createCandidateDate(dayDate, hour),
      score,
    }))
    .filter(({ date }) => isValidTimeSlot(date, now, minAllowedPostTime, channelPosts));
};

const getBestTimeSlotForDay = (
  timeSlots: Array<{ date: Date; score: number }>
): { date: Date; score: number } | null => {
  return timeSlots.reduce(
    (best, current) => (!best || current.score > best.score ? current : best),
    null as { date: Date; score: number } | null
  );
};

const generateFallbackDate = (minAllowedPostTime: Date, channelPosts: Post[]): Date => {
  const generateCandidates = (startTime: Date): Date[] => {
    return Array.from({ length: 48 }, (_, i) => addMinutes(startTime, i * 30));
  };

  return (
    generateCandidates(minAllowedPostTime).find((date) => !hasConflict(date, channelPosts, 5)) ||
    minAllowedPostTime
  );
};

export const calculateOptimalScheduleDate = (
  subreddit: Subreddit,
  subredditPosts: Post[],
  channelPosts: Post[]
): Date => {
  const postingTimes = subreddit.postingTimesData || [];
  const now = new Date();
  const maxDaysToLookAhead = 14;
  const searchStartDate = getSearchStartDate(now);
  const minAllowedPostTime = calculateMinAllowedPostTime(
    searchStartDate,
    subreddit,
    subredditPosts
  );

  if (postingTimes.length === 0) {
    return generateFallbackDate(minAllowedPostTime, channelPosts);
  }

  const dayOffsets = Array.from({ length: maxDaysToLookAhead }, (_, i) => i);

  const bestTimeSlot = dayOffsets
    .map((dayOffset) => createDateForDay(searchStartDate, dayOffset))
    .map((dayDate) =>
      getValidTimeSlotsForDay(dayDate, postingTimes, now, minAllowedPostTime, channelPosts)
    )
    .map(getBestTimeSlotForDay)
    .find((timeSlot) => timeSlot !== null);

  if (bestTimeSlot) {
    bestTimeSlot.date = addMinutes(bestTimeSlot.date, Math.floor(Math.random() * 30));
  }

  return bestTimeSlot?.date ?? generateFallbackDate(minAllowedPostTime, channelPosts);
};
