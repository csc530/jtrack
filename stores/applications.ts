import IDB from "../models/IDB";
const useApplicationsStore = defineStore("applications", () => {
    // init
    const idb = ref<IDB | undefined>(undefined);
    onMounted(async() => {
        idb.value = await IDB.newConnection(1);
        applications.value = await idb.value.getValues(idbStores.APPLICATIONS);
    });

    // state
    const actionState = ref();

    // getters
    const applications = ref<IDbResult<DbApplication>>();

    // actions

    function addApplication(application: DbApplication) {
        const data: IDbValue<DbApplication> = { ...toRaw(application), _id: crypto.randomUUID() };
        idb.value?.add(idbStores.APPLICATIONS, data);
        applications.value?.update()
    }


    // etc


    function watchActionState(request: IDBRequest) {

    }
    function toRaw<T>(val: T): T {
        console.log("toRaw", val);
        if (isReactive(val))
            return Object.entries(val as object).reduce((obj, [key, val]) => ({ ...obj, [key]: toRaw(val) }), {}) as T;
        else if (isRef<T>(val))
            return toRaw(val.value);
        else
            return val;
    }

    return {
        // state
        idb,
        // getters
        applications,
        // actions
        addApplication
    };
});

export default useApplicationsStore;