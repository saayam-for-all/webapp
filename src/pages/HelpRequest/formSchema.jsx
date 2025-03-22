import { z } from "zod";

const FormSchema = z.object({
  mainCategory: z.string({
    required_error: "Please select a Category.",
  }),
  subCategory: z.string({
    required_error: "Please select a Service.",
  }),
  title: z.string({
    required_error: "Title is required.",
  }),
  description: z.string({
    required_error: "Description is required.",
  }),
  location: z.string({
    required_error: "Location is required.",
  }),
  availability: z.array(
    z.object({
      day: z.string({
        required_error: "Please select a day.",
      }),
      startTimeHour: z.string().refine((val) => {
        const num = parseInt(val, 10);
        return num >= 1 && num <= 12;
      }),
      startTimeMinute: z.string().refine((val) => {
        const num = parseInt(val, 10);
        return num >= 0 && num <= 59;
      }),
      startTimeAMPM: z.string(),
      endTimeHour: z.string().refine((val) => {
        const num = parseInt(val, 10);
        return num >= 1 && num <= 12;
      }),
      endTimeMinute: z.string().refine((val) => {
        const num = parseInt(val, 10);
        return num >= 0 && num <= 59;
      }),
      endTimeAMPM: z.string(),
    }),
  ),
  urgencyLevel: z.string({
    required_error: "Please select a urgency level.",
  }),
});

const formDefaultValues = {
  mainCategory: "",
  subCategory: "",
  title: "",
  description: "",
  location: "",
  availability: [
    {
      day: "",
      startTimeHour: "",
      startTimeMinute: "",
      startTimeAMPM: "",
      endTimeHour: "",
      endTimeMinute: "",
      endTimeAMPM: "",
    },
  ],
  urgencyLevel: "",
};

export { FormSchema, formDefaultValues };
