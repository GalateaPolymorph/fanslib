import { ContentSchedule } from "../features/content-schedules/entity";
import { db } from "../lib/db";

const CONTENT_SCHEDULE_FIXTURES: Omit<ContentSchedule, "createdAt" | "updatedAt" | "channel">[] = [
  {
    id: "schedule-001",
    type: "daily",
    channelId: "fansly",
    preferredTimes: ["12:00"],
  },
];

export const loadContentScheduleFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);
  const existingSchedules = await repository.find();

  const schedulePromises = CONTENT_SCHEDULE_FIXTURES.map(async (schedule) => {
    if (existingSchedules.find((s) => s.id === schedule.id)) {
      return null;
    }
    return repository.save(schedule);
  });

  await Promise.all(schedulePromises);
};
