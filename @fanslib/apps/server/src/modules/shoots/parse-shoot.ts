import { basename } from 'path';

export type ShootInfo = {
  name: string;
  date: Date;
};

const isValidShootDate = (date: Date): boolean => {
  const now = new Date();
  const minDate = new Date('1990-01-01');
  const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // Up to 1 year in future

  return date >= minDate && date <= maxDate;
};

const SHOOT_FOLDER_PATTERN =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})_(?<name>.+)$/;

export const parseShootFromFolderPath = (
  folderPath: string
): ShootInfo | null => {
  const folderName = basename(folderPath);
  const match = folderName.match(SHOOT_FOLDER_PATTERN);

  const yearString = match?.groups?.year;
  const monthString = match?.groups?.month;
  const dayString = match?.groups?.day;
  const name = match?.groups?.name;

  if (!yearString || !monthString || !dayString || !name) {
    return null;
  }

  const year = parseInt(yearString, 10);
  const month = parseInt(monthString, 10);
  const day = parseInt(dayString, 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (!isValidShootDate(date)) {
    return null;
  }

  // Validate that the date components match what we parsed (handles invalid dates like Feb 30)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    name: name.trim(),
    date: date,
  };
};
