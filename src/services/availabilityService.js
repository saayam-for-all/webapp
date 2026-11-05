import { z } from "zod";
import api from "./api";
import endpoints from "./endpoints.json";

const frequencies = [
  "Everyday",
  "Weekdays",
  "Weekends",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::00)?$/);
const snapshot = z.object({
  userId: z.string(),
  timezone: z.string(),
  slots: z.array(
    z.object({
      id: z.number().int(),
      frequency: z.enum(frequencies),
      startTime: time,
      endTime: time,
    }),
  ),
  lastUpdatedAt: z.string().datetime().nullable(),
});

const read = (response, userId) => {
  if (response.data?.success !== true)
    throw new Error("Availability request failed");
  const data = snapshot.parse(response.data.data);
  if (data.userId !== userId)
    throw new Error("Availability belongs to another user");
  if (data.timezone) new Intl.DateTimeFormat("en", { timeZone: data.timezone });
  return {
    ...data,
    slots: data.slots.map((slot) => ({
      ...slot,
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
    })),
  };
};

export const fetchAvailability = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  return read(await api.post(endpoints.AVAILABILITY, { userId }), userId);
};

export const saveAvailability = async (userId, values) => {
  if (!userId) throw new Error("User ID is required");
  const body = {
    userId,
    timezone: values.timezone,
    vacationMode: values.vacationMode,
    vacationStartDate: values.vacationStartDate || "",
    vacationEndDate: values.vacationEndDate || "",
    slots: values.slots.map(({ frequency, startTime, endTime }) => ({
      frequency,
      startTime,
      endTime,
    })),
  };
  return read(await api.put(endpoints.AVAILABILITY, body), userId);
};
