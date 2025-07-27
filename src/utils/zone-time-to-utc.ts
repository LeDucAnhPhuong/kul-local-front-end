import { format, fromZonedTime } from 'date-fns-tz';

export const zoneTimeToUTC = (date: Date, timeZone = 'UTC'): Date => {
  const zoneTime = format(date, "yyyy-MM-dd'T'HH:mm:ssXXX", {
    timeZone,
  });

  const utcDate = fromZonedTime(new Date(zoneTime), 'UTC');

  return utcDate;
};
