import { z } from "zod";

const value = z.object({
    _id: z.string().uuid().or(z.number())
}).passthrough();
const result = z.array(z.union([value, z.any()])).and(z.object({
    update: z.function().args().returns(z.promise(z.void()))
}));

export enum idbStores {
    APPLICATIONS = "applications"
}

export type IDbValue<T extends object> = z.infer<typeof value> & T;
export type IDbResult<T> = z.infer<typeof result> & T[];

export default  {
    value,
    result
};