<template>
  <UContainer as="main">
    <h1>Application tracker</h1>

    <component :is="settings.dialogStyle" v-model="openSettings">
      <SettingForm :model-value="settings" @submit="e => settings = e.data" />
    </component>


    <UButton icon="material-symbols:settings" size="sm" variant="ghost" title="settings"
      @click="() => openSettings = true" />

    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <UButton disabled label="Export" @click="() => console.log('export')" />
          <UButton disabled label="Import" @click="() => console.log('import')" />
          <UButton label="Reset" color="red" @click="clearApplications" />
          <UButton label="Add application" @click="() => dialog = Dialog.ADD" />
        </div>
      </template>

      <UTable v-model="tableRow" :rows="rows" :columns="tableColumns" @select="onRowSelect">
        <template #empty-state>
          <p class="italic text-sm">No job applications!</p>
        </template>
      </UTable>
      <UPagination v-model="page" :total="applicationsStore.applications?.length ?? NaN" :max="9" show-last
        :page-count="pageCount" show-first />
    </UCard>
  </UContainer>

  <component :is="settings.dialogStyle" :model-value="Boolean(dialog)" @update:model-value="e => dialog = e">
    <UCard v-if="dialogBody" class="flex flex-col flex-1">
      <template #header>
        <h2>{{ dialogBody.header }}</h2>
      </template>

      <template #default>
        <component :is="dialogBody.component" v-if="dialogBody.component" v-bind="dialogBody.props"
          @submit="dialogBody.props['v-on:submit']" @error="dialogBody.props['v-on:error']"
          @cancel="dialogBody.props['v-on:cancel']" />
      </template>



      <template #footer />
    </UCard>
    <ApplicationDialog v-else-if="selectedRow" :application="selectedRow" @edit="() => dialog = Dialog.EDIT"
      @delete:activity="deleteActivity" @delete:application="deleteApplication"
      @add:update="() => dialog = Dialog.UPDATE" @close="() => dialog = false" />


  </component>
</template>

<script setup lang="ts">
  import USlideover from '#ui/components/overlays/Slideover.vue';
  import { ActivityForm, ApplicationForm } from "#components";
  import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';

  useHead({
    titleTemplate: (title) => title
      ? `${title} - JTracker`
      : 'J-Tracker'
  });


  //types

  enum Dialog {
    ADD = 'add',
    EDIT = 'edit',
    DELETE = 'delete',
    UPDATE = 'update',
  }


  //constants
  const tableColumns = [
    {
      label: 'Job title',
      key: 'job.title',
    },
    {
      label: 'Company',
      key: 'job.company',
    },
    {
      label: 'Date applied',
      key: 'dateApplied',
      sortable: true
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true
    },
    {
      label: 'Method',
      key: 'method',
      sortable: true
    },
    {
      label: 'Location',
      key: 'location',
      sortable: true
    },
  ];
  const pageCount = 7;
  const defaultApplication = () => ({
    job: {
      title: undefined,
      company: undefined,
      description: "",
    },
    dateApplied: new Date(),
    created: new Date(),
    status: 'applied',
    method: 'online',
    location: undefined,
    lastUpdated: new Date().toISOString(),
  } as DeepPartial<DbApplication>);


  const defaultActivity = (): DeepPartial<DbActivity> => ({
    type: undefined,
    date: new Date(),
    details: undefined,
  });


  //reactivity
  //stores
  const applicationsStore = stores.useApplicationsStore();
  //html-ref
  //other
  const dialog = ref<Dialog | boolean>();
  const settings = reactive({ dialogStyle: markRaw(USlideover) });
  const applicationState = ref<IDbValue<DbApplication> | ReturnType<typeof defaultApplication>>(defaultApplication());
  const activity = ref<IDbValue<DbActivity> | ReturnType<typeof defaultActivity>>(defaultActivity());
  const tableRow = ref<IDbValue<DbApplication>[]>([]);
  const page = ref(1);
  const openSettings = ref(false);
  //computed
  const dialogBody = computed(() => {
    switch (dialog.value) {
      case Dialog.ADD: return { component: ApplicationForm, header: 'Add application', props: { "modelValue": defaultApplication(), "v-on:cancel": closeApplicationDialog, "v-on:update:model-value": (e) => applicationState.value = e, "v-on:submit": addApplication, "v-on:error": onError } };
      case Dialog.EDIT: return { component: ApplicationForm, header: 'Edit application', props: { "modelValue": toRaw(selectedRow.value), "v-on:cancel": backToApplicationDialog, "v-on:submit": editApplication, "v-on:error": onError } };
      case Dialog.UPDATE: return { component: ActivityForm, header: 'Edit application', props: { "modelValue": defaultActivity(), "v-on:cancel": backToApplicationDialog, "v-on:submit": addActivity, "v-on:error": undefined } };
      default: return undefined;
    }
  });
  const selectedRow = computed(() => tableRow.value?.[0]);



  const rows = computed(() => {
    return applicationsStore.applications?.slice((page.value - 1) * pageCount, (page.value) * pageCount) ?? [];
  });




  //functions
  async function addApplication(event: FormSubmitEvent<DbApplication>) {
    console.log(event.data);
    applicationsStore.addApplication(event.data);
    dialog.value = false;
    // setDoc(testDoc_chris_myDocRef, event.data);
  }
  async function onError(event: FormErrorEvent) {
    event.errors.forEach((error) => {
      console.error(error);
    });
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearApplications() {
    if (confirm("Are you sure?"))
      applicationsStore.clearApplications();
  }

  function onRowSelect(row: IDbValue<DbApplication>) {
    if (row._id !== tableRow.value?.[0]?._id)
      tableRow.value = [row];
    // temp.value = 1;
    // applicationState.value = ref(temp.value);
    applicationState.value = toRaw(row);
    dialog.value = true;
  }

  function editApplication(event: FormSubmitEvent<IDbValue<DbApplication>>) {
    const data = db.application.passthrough().and(idb.value).parse(event.data);
    applicationsStore.editApplication(data);
    dialog.value = false;
  }

  function deleteApplication(application: IDbValue<DbApplication>) {
    if (confirm("Are you sure?"))
      applicationsStore.deleteApplication(application);
    dialog.value = false;
  }

  function addActivity(event: FormSubmitEvent<DbActivity>) {
    console.log(selectedRow.value);
    console.log(event.data);
    const application = db.application.passthrough().and(idb.value).parse(selectedRow.value);
    if (!application) return;
    application.activity.push(event.data);
    applicationsStore.editApplication(application);
    dialog.value = false;
  }

  function backToApplicationDialog() {
    dialog.value = true;
  }

  function closeApplicationDialog() {
    dialog.value = false;
  }

  function deleteActivity(activity: DbActivity) {
    const application = db.application.passthrough().and(idb.value).parse(selectedRow.value);
    if (!application && !confirm("Are you sure?"))
      return;
    application.activity = application.activity.filter((act) => act !== activity);
    applicationsStore.editApplication(application);
    dialog.value = false;
  }
</script>
