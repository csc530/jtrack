
export default class IDB {
    // actual private "#" does not work as a reactive object can't access it -- the proxy
    private idb: IDBDatabase;
    status: "open" | "closed" = "closed";

    static async newConnection(version: number) {
        const req = window.indexedDB.open("csc530-job-tracker", version);
        const idb = new IDB();
        req.addEventListener("upgradeneeded", IDB.#upgradeIdb.bind(idb));
        req.addEventListener("success", idb.#initializeIdb.bind(idb), { once: true });
        req.onerror = (event) => {
            console.error("Failed to open indexedDB", event);
            throw event;
        };
        await getPromiseFromEvent(req, "success");
        return idb;
    }

    constructor() {
        // throw new Error("Illegal constructor");
    }

    get idbVersion() {
        return this.idb.version;
    }

    get stores() {
        return this.idb.objectStoreNames;
    };

    async clearStore(store: idbStores) {
        const request = this.idb.transaction(store, "readwrite").objectStore(store).clear();
        if(!await IDB.#requestIsDone(request))
            throw new Error("Failed to clear store");
    }

    async add(storeName: idbStores, data: IDbValue<object> | IDbValue<object>[]) {
        if (!Array.isArray(data))
            data = [data];
        const store = this.idb.transaction(storeName, "readwrite").objectStore(storeName);
        return Promise.all(data.map((data) => store.add(data)));
    }

    getStore(store: idbStores, mode: IDBTransactionMode = "readonly") {
        return this.idb.transaction(store, mode).objectStore(store);
    }

    async getValues(store: idbStores, query?: IDBKeyRange) {
        const req = this.idb.transaction(store, "readonly").objectStore(store).getAll(query);
        await getPromiseFromEvent(req, "success");
        const base = this;
        const result: IDbResult<typeof req.result[number]> = Object.assign([],req.result, {
            update: async function value(this: typeof req.result) {
                    const req = base.idb.transaction(store, "readonly").objectStore(store).getAll(query);
                    await getPromiseFromEvent(req, "success");
                    const res = req.result;
                    for (let i = 0; i < this.length; i++)
                        if (i in res)
                            this[i] = res[i];
                        else
                            delete this[i];
                }
        });
        return result;
    }

    async getKeys(store: idbStores, query?: IDBKeyRange) {
        const req = this.idb.transaction(store, "readonly").objectStore(store).getAllKeys(query);
        await getPromiseFromEvent(req, "success");
        return req.result;
    }

    async getValuesWithKeys(store: idbStores, query?: IDBKeyRange) {
        const keys = await this.getKeys(store, query);
        return keys.map(async (key) => {
            const req = this.idb.transaction(store, "readonly").objectStore(store).get(key);
            await getPromiseFromEvent(req, "success");
            return { key, value: req.result };
        });
    }

    #initializeIdb(ev: Event) {
        this.idb = (ev.target as IDBOpenDBRequest).result;
        this.status = "open";
    }

    static #upgradeIdb(ev: IDBVersionChangeEvent) {
        const db = (ev.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("applications")) {
            db.createObjectStore("applications", { autoIncrement: true, keyPath: "_id" });
        }
    }

    static async #requestIsDone(request: IDBRequest) {
        await Promise.race([getPromiseFromEvent(request, "success"), getPromiseFromEvent(request, "error")]);
        return request.readyState === "done";
    }
}


class IDBTransactionError extends Error {

    constructor(message: string) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, IDBTransactionError.prototype);
        this.name = "IDBTransactionError";
    }
}