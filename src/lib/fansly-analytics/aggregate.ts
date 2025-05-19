import { Post } from "../../features/posts/entity";

export type DataPoint = {
  date: string; // ISO string format
  daysSincePost: number;
  Views: number;
  averageWatchTimeSeconds: number;
  averageWatchTimePercent: number;
};

/**
 * Ensures that cumulative views are monotonically increasing (never decreasing)
 * This fixes any inconsistencies that might have been introduced during interpolation
 */
const ensureMonotonicViews = (dataPoints: DataPoint[]): DataPoint[] => {
  if (dataPoints.length <= 1) {
    return dataPoints;
  }

  // Make a deep copy to avoid mutating the input
  const result = [...dataPoints];

  // Track the maximum views seen so far
  let maxViews = result[0].Views;

  // Ensure each point's views are at least as high as the previous maximum
  for (let i = 1; i < result.length; i++) {
    if (result[i].Views < maxViews) {
      result[i] = {
        ...result[i],
        Views: maxViews,
      };
    } else {
      maxViews = result[i].Views;
    }
  }

  return result;
};

/**
 * Aggregates analytics data from a post into a format suitable for visualization
 *
 * @param post The post containing analytics datapoints
 * @param trimPlateau Whether to trim the data at plateau points (defaults to true)
 * @returns Array of DataPoint objects for visualization
 */
export const aggregatePostAnalyticsData = (post: Post, trimPlateau = true): DataPoint[] => {
  if (!post.fanslyAnalyticsDatapoints || post.fanslyAnalyticsDatapoints.length === 0) {
    return [];
  }

  const relevantMedia = post.postMedia.find((m) => m.media.tier?.level === 0);
  const videoLengthMs = (relevantMedia?.media?.duration || 0) * 1000;
  const postDate = new Date(post.date);
  postDate.setHours(0, 0, 0, 0); // Normalize to start of day

  // Sort datapoints by timestamp
  const sortedDatapoints = [...post.fanslyAnalyticsDatapoints].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Get the last datapoint date to determine the full date range
  const lastDatapointDate = new Date(sortedDatapoints[sortedDatapoints.length - 1].timestamp);
  lastDatapointDate.setHours(0, 0, 0, 0); // Normalize to start of day

  // Create a map to store datapoints by date string for quick lookup
  const datapointsByDay = new Map<string, DataPoint>();

  // Initialize with post date
  const initialPoint: DataPoint = {
    date: formatter.format(postDate),
    daysSincePost: 0,
    Views: 0,
    averageWatchTimeSeconds: 0,
    averageWatchTimePercent: 0,
  };
  datapointsByDay.set(postDate.toISOString().split("T")[0], initialPoint);

  // Process all datapoints and aggregate them
  let cumulativeViews = 0;
  let cumulativeInteractionTime = 0;

  sortedDatapoints.forEach((datapoint) => {
    cumulativeViews += datapoint.views;
    cumulativeInteractionTime += datapoint.interactionTime;

    const averageWatchTimeMs =
      cumulativeViews > 0 ? cumulativeInteractionTime / cumulativeViews : 0;
    const averageWatchTimeSeconds = averageWatchTimeMs / 1000;
    const averageWatchTimePercent = videoLengthMs
      ? Math.round((averageWatchTimeMs / videoLengthMs) * 100)
      : 0;

    const datapointDate = new Date(datapoint.timestamp);
    datapointDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const daysSincePost = Math.floor(
      (datapointDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const dateKey = datapointDate.toISOString().split("T")[0];

    datapointsByDay.set(dateKey, {
      date: formatter.format(datapointDate),
      daysSincePost,
      Views: cumulativeViews,
      averageWatchTimeSeconds,
      averageWatchTimePercent,
    });
  });

  // Generate a complete array of dates with interpolated values
  const dataPoints: DataPoint[] = [];
  const dayMs = 24 * 60 * 60 * 1000;

  // Short circuit for no datapoints
  if (sortedDatapoints.length === 0) {
    return [initialPoint];
  }

  // STEP 1: Create an array of all dates in the range (one per day)
  const allDateKeys: string[] = [];

  // Cap at today's date to avoid projecting into the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only interpolate if we have at least two datapoints
  if (sortedDatapoints.length >= 2) {
    // Cap the end date to today or lastDatapointDate, whichever is earlier
    const endDate = new Date(Math.min(lastDatapointDate.getTime(), today.getTime()));

    for (
      let currentDate = new Date(postDate);
      currentDate <= endDate;
      currentDate = new Date(currentDate.getTime() + dayMs)
    ) {
      allDateKeys.push(currentDate.toISOString().split("T")[0]);
    }
  } else if (sortedDatapoints.length === 1) {
    // With only one datapoint, just use that date and the post date
    allDateKeys.push(postDate.toISOString().split("T")[0]);
    const onlyDatapointDate = new Date(sortedDatapoints[0].timestamp);
    onlyDatapointDate.setHours(0, 0, 0, 0);
    if (onlyDatapointDate.getTime() !== postDate.getTime()) {
      allDateKeys.push(onlyDatapointDate.toISOString().split("T")[0]);
    }
  } else {
    // No datapoints, just use post date
    allDateKeys.push(postDate.toISOString().split("T")[0]);
  }

  // STEP 2: For each date, find the next date that has actual data
  // This will be used for linear interpolation
  const nextDataDateMap = new Map<string, string>();
  for (let i = 0; i < allDateKeys.length; i++) {
    const currentKey = allDateKeys[i];

    if (datapointsByDay.has(currentKey)) {
      // This date already has data, so its "next data date" is itself
      nextDataDateMap.set(currentKey, currentKey);
      continue;
    }

    // Find next date with data by looking forward
    let nextDataKey = null;
    for (let j = i + 1; j < allDateKeys.length; j++) {
      if (datapointsByDay.has(allDateKeys[j])) {
        nextDataKey = allDateKeys[j];
        break;
      }
    }

    if (nextDataKey) {
      nextDataDateMap.set(currentKey, nextDataKey);
    }
  }

  // STEP 3: Process each date in order, adding actual or interpolated points to the dataset
  for (let i = 0; i < allDateKeys.length; i++) {
    const dateKey = allDateKeys[i];
    const currentDate = new Date(dateKey + "T00:00:00Z");

    if (datapointsByDay.has(dateKey)) {
      // Use existing datapoint for dates that have actual data
      dataPoints.push(datapointsByDay.get(dateKey)!);
      continue;
    }

    // We need to create an interpolated point for this date

    // Find previous date with actual data (looking backward)
    let prevKey = null;
    for (let j = i - 1; j >= 0; j--) {
      if (datapointsByDay.has(allDateKeys[j])) {
        prevKey = allDateKeys[j];
        break;
      }
    }

    // Get the next date with data (we already computed this)
    const nextKey = nextDataDateMap.get(dateKey);

    // For linear interpolation, we need both a previous and next point with actual data
    if (prevKey && nextKey) {
      const prevPoint = datapointsByDay.get(prevKey)!;
      const nextPoint = datapointsByDay.get(nextKey)!;

      // Calculate where we are between the previous and next points (0.0 to 1.0)
      const prevDate = new Date(prevKey + "T00:00:00Z");
      const nextDate = new Date(nextKey + "T00:00:00Z");

      const totalTimeSpan = nextDate.getTime() - prevDate.getTime();
      const currentTimeSpan = currentDate.getTime() - prevDate.getTime();
      const ratio = totalTimeSpan > 0 ? currentTimeSpan / totalTimeSpan : 0;

      // Apply linear interpolation formula: value = start + ratio * (end - start)
      // For cumulative views, ensure they never decrease (can only stay the same or increase)
      const rawInterpolatedViews = prevPoint.Views + ratio * (nextPoint.Views - prevPoint.Views);
      const interpolatedViews = Math.max(rawInterpolatedViews, prevPoint.Views);

      const interpolatedWatchTimeSeconds =
        prevPoint.averageWatchTimeSeconds +
        ratio * (nextPoint.averageWatchTimeSeconds - prevPoint.averageWatchTimeSeconds);

      const interpolatedWatchTimePercent =
        prevPoint.averageWatchTimePercent +
        ratio * (nextPoint.averageWatchTimePercent - prevPoint.averageWatchTimePercent);

      const daysSincePost = Math.floor((currentDate.getTime() - postDate.getTime()) / dayMs);

      // Create the interpolated datapoint
      const interpolatedPoint: DataPoint = {
        date: formatter.format(currentDate),
        daysSincePost,
        // Ensure views are always increasing and rounded to whole numbers
        Views: Math.max(Math.round(interpolatedViews), prevPoint.Views),
        averageWatchTimeSeconds: interpolatedWatchTimeSeconds,
        averageWatchTimePercent: Math.round(interpolatedWatchTimePercent),
      };

      datapointsByDay.set(dateKey, interpolatedPoint);
      dataPoints.push(interpolatedPoint);
    } else {
      // If we can't do proper interpolation (missing prev or next),
      // use the most recent previous value
      const prevPointKey = prevKey || dateKey;
      const prevPoint = datapointsByDay.get(prevPointKey) || initialPoint;

      const daysSincePost = Math.floor((currentDate.getTime() - postDate.getTime()) / dayMs);

      // Create flat interpolation (copy previous values)
      const interpolatedPoint: DataPoint = {
        date: formatter.format(currentDate),
        daysSincePost,
        // Maintain the non-decreasing property of cumulative views
        Views: Math.max(prevPoint.Views, 0),
        averageWatchTimeSeconds: prevPoint.averageWatchTimeSeconds,
        averageWatchTimePercent: prevPoint.averageWatchTimePercent,
      };

      datapointsByDay.set(dateKey, interpolatedPoint);
      dataPoints.push(interpolatedPoint);
    }
  }

  // Ensure cumulative views are monotonically increasing
  const processedDataPoints = ensureMonotonicViews(dataPoints);

  // Find plateau points and trim data if requested
  return trimPlateau ? trimDataAtPlateau(processedDataPoints) : processedDataPoints;
};

/**
 * Detects plateaus in the data and trims off datapoints after the plateau starts.
 * This helps focus the visualization on the period of actual change by "zooming in"
 * on the most interesting part of the graph where data is actively changing.
 *
 * The algorithm:
 * 1. Calculates the change percentage between consecutive points
 * 2. Uses a moving average to smooth out fluctuations
 * 3. Applies an adaptive threshold based on the data's characteristics
 * 4. Detects when growth flattens out (reaches a plateau)
 * 5. Trims the data series to focus on the active growth period
 */
const trimDataAtPlateau = (dataPoints: DataPoint[]): DataPoint[] => {
  if (dataPoints.length <= 3) {
    return dataPoints;
  }

  // Always keep at least these many points regardless of plateaus
  // This ensures we don't cut off too much data even if changes appear early
  const minimumPointsToKeep = Math.min(7, dataPoints.length);

  // Calculate changes between consecutive points
  const changes: number[] = [];

  for (let i = 1; i < dataPoints.length; i++) {
    const absoluteChange = dataPoints[i].Views - dataPoints[i - 1].Views;
    const relativeChangePercent =
      dataPoints[i - 1].Views === 0 ? 100 : (absoluteChange / dataPoints[i - 1].Views) * 100;

    changes.push(relativeChangePercent);
  }

  // Calculate moving average to smooth out fluctuations and reduce noise
  // This helps identify true plateaus versus temporary fluctuations
  const movingAverageWindow = 3;
  const movingAverages: number[] = [];

  for (let i = 0; i < changes.length; i++) {
    const windowStart = Math.max(0, i - movingAverageWindow + 1);
    const windowSize = i - windowStart + 1;
    const sum = changes.slice(windowStart, i + 1).reduce((sum, val) => sum + val, 0);
    movingAverages.push(sum / windowSize);
  }

  // Find where the plateau starts using adaptive threshold
  let plateauStartIndex = -1;

  // Calculate adaptive threshold based on data characteristics
  // This makes the algorithm work well across different datasets with varying growth patterns
  const maxChange = Math.max(...changes);

  // Adaptive threshold: lower of 5% of max change or 1.5% absolute
  // This ensures we detect plateaus relative to the scale of the data
  const adaptiveThreshold = Math.min(maxChange * 0.05, 1.5);

  // Number of consecutive low-change points needed to confirm we've hit a plateau
  // For shorter datasets we require fewer points to detect a plateau
  const consecutiveRequired = Math.min(4, Math.ceil(dataPoints.length * 0.1));
  let lowChangeCount = 0;

  for (let i = 0; i < movingAverages.length; i++) {
    if (movingAverages[i] <= adaptiveThreshold) {
      lowChangeCount++;

      // Found a sequence of low changes that meets our criteria for a plateau
      if (lowChangeCount >= consecutiveRequired && i >= minimumPointsToKeep - 2) {
        // Calculate where the plateau actually starts
        // We add 2: +1 to account for moving average offset, +1 to include one point from plateau
        plateauStartIndex = i - lowChangeCount + 2;
        break;
      }
    } else {
      lowChangeCount = 0; // Reset counter when significant change occurs
    }
  }

  // If a plateau was found and we have enough points, trim the data
  if (plateauStartIndex > 0 && plateauStartIndex < dataPoints.length - 2) {
    // Add three datapoints after plateau detection point to visually show
    // the beginning of the flattening trend without including the entire plateau
    return dataPoints.slice(0, plateauStartIndex + 3);
  }

  return dataPoints;
};
