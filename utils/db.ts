import { z } from "zod";
const jobs = z.object({
    title: z.coerce.string().min(3, "Job title must be at least 3 characters long.").trim(),
    description: z.string().trim().optional(),
    // location: z.string(),
    company: z.string().min(2).trim(),
});

const applicationStatus = z.enum(["applied", "interview", "declined"]);
const applicationMethod = z.enum(["email", "phone", "in-person", "online"]);


// /jobs/{jobId}/activity/{activityId}
const activity = z.object({
    type: z.enum(["rejection", "interview", "decline", "employment", "acknowledgement", "feedback", "update"]).describe("The nature of the application update"),
    date: z.coerce.string().date().or(z.coerce.date()).describe("The date of the update."),
    details: z.string().optional(),
});


// /jobs/{jobId}
const application = z.object({
    job: jobs,
    activity: z.array(activity).default([]).describe("The activity log of the application."),
    status: applicationStatus,
    dateApplied: z.coerce.date().max(new Date(Date.now() + 1000 * 60 * 60 * 24), "Applied date must be in the past.").or(z.string().date()).describe("When the application was made."),
    method: applicationMethod.default("online"),
    location: z.string().trim().describe("Where the application was made: website, phone number, location (physical)."),
    lastUpdated: z.coerce.string().datetime().default(new Date().toISOString()).describe("The last time the application was updated."),
    created: z.coerce.date(),
});

export default {
    application,
    activity,
    applicationStatus,
    applicationMethod,
};

export type DbApplication = z.infer<typeof application>;

export type DbActivity = z.infer<typeof activity>;