import { z } from "zod";

const idbValue = z.object({
    _id: z.string().uuid().or(z.number())
}).passthrough();

const idbResult = z.array(z.union([idbValue, z.any()])).and(z.object({
    update: z.function().args().returns(z.promise(z.void()))
}));

export enum idbStores {
    APPLICATIONS = "applications"
}

export default idbValue;
export type IDbValue<T extends object> = z.infer<typeof idbValue> & T;
export type IDbResult<T> = z.infer<typeof idbResult> & T[];
