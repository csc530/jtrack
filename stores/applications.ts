import IDB from "../models/IDB";
const useApplicationStore = defineStore("applications", () => {
    // init
    const idb = ref<IDB | undefined>(undefined);
    onMounted(async () => {
        idb.value = await IDB.newConnection(1);
        updateApplications();
    });

    // state
    const actionState = ref();

    // getters
    const applications = ref<IDbResult<DbApplication>>();

    // actions
    function deleteApplication(application: IDbValue<DbApplication>) {
        idb.value?.delete(idbStores.APPLICATIONS, application._id);
        updateApplications();
    }
    function addApplication(application: DbApplication) {
        const data: IDbValue<DbApplication> = { ...toRaw(application), _id: crypto.randomUUID() };
        idb.value?.add(idbStores.APPLICATIONS, data);
        updateApplications();
    }

    function editApplication(application: IDbValue<DbApplication>) {
        idb.value?.update(idbStores.APPLICATIONS, application);
        updateApplications();
    }

    function clearApplications() {
        idb.value?.clearStore(idbStores.APPLICATIONS);
        updateApplications();
    }

    async function updateApplications() {
        applications.value = await idb.value?.getValues(idbStores.APPLICATIONS);
    }


    // etc


    function watchActionState(request: IDBRequest) {

    }


    return {
        // state
        idb,
        // getters
        applications,
        // actions
        addApplication,
        clearApplications,
        updateApplications,
        editApplication,
        deleteApplication
    };
});

export default useApplicationStore;