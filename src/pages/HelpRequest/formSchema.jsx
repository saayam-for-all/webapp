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
      startTime: z.string(),
      endTime: z.string(),
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
      startTime: "",
      endTime: "",
    },
  ],
  urgencyLevel: "",
};

export { FormSchema, formDefaultValues };
