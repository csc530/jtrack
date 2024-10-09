import { z } from "zod";
const jobs = z.object({
    title: z.coerce.string().min(3, "Job title must be at least 3 characters long.").trim(),
    description: z.string().trim().nullable(),
    // location: z.string(),
    company: z.string().min(2).trim(),
});

const applicationStatus = z.enum(["applied", "interview", "declined"]);
const applicationMethod = z.enum(["email", "phone", "in-person","online"]);

const application = z.object({
    job: jobs,
    status: applicationStatus,
    method: applicationMethod.default("online"),
    location: z.string().trim().describe("Where the application was made: website, phone number, location (physical)."),
    lastUpdated: z.coerce.date(),
    created : z.coerce.date(),
});
export default {
    application,
    applicationStatus,
    applicationMethod,
};

export type DbApplication = z.infer<typeof application>;