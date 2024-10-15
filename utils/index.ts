/**
 * @link https://stackoverflow.com/a/70789108/16929246
 * @param item
 * @param event
 * @returns
 */
export function getPromiseFromEvent(item: EventTarget, event: string): Promise<void> {
    return new Promise<void>((resolve) => {
        const listener = () => {
            item.removeEventListener(event, listener);
            resolve();
        };
        item.addEventListener(event, listener);
    });
}
export function toRaw<T>(val: T): T {
    if (isReactive(val))
        return Object.entries(val as object).reduce((obj, [key, val]) => ({ ...obj, [key]: toRaw(val) }), {}) as T;
    else if (isRef<T>(val))
        return toRaw(val.value);
    else
        return val;
}

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;