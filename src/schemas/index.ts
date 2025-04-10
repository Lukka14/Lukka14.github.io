import { z } from "zod";

export const formSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    movieName: z.string()
        .min(1, "Movie name is required")
        .max(100, "Movie name must be less than 100 characters"),
    genre: z.enum(["action", "comedy", "drama"], {
        errorMap: () => ({ message: "Please select a genre" })
    }),
    notifyNewReleases: z.boolean().optional(),
    notificationFrequency: z.enum(["daily", "weekly", "monthly"]),
    additionalNotes: z.string().max(500, "Notes must be less than 500 characters").optional()
});
