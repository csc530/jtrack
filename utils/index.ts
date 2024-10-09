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
