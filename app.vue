<template>
  <UContainer as="main">
    <h1>Application tracker</h1>

    <component :is="settings.dialogStyle" v-model="openSettings">
      <SettingForm :model-value="settings" @submit="e => settings = e.data" />
    </component>


    <UButton
icon="material-symbols:settings" size="sm" variant="ghost" title="settings"
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
      <UPagination
v-model="page" :total="applicationsStore.applications?.length ?? NaN" :max="9" show-last
        :page-count="pageCount" show-first />
    </UCard>
  </UContainer>

  <component :is="settings.dialogStyle" :model-value="Boolean(dialog)" @update:model-value="e => dialog = e">
    <ApplicationDialog
v-if="!dialogBody" :application="selectedRow" @edit="() => dialog = Dialog.EDIT"
      @delete="deleteApplication" @close="() => dialog = false" />
    <UCard v-else class="flex flex-col flex-1">
      <template #header>
        <h2>{{ dialogBody.header }}</h2>
      </template>

      <template #default>
        <ApplicationForm v-bind="dialogBody.props" @submit="dialogBody.props['v-on:submit']" @error="dialogBody.props['v-on:error']" />

        <!-- <ApplicationForm v-model="applicationState" @submit="onSubmit" @error="onError"  /> -->
      </template>



      <template #footer />
    </UCard>
  </component>
</template>

<script setup lang="ts">
  import USlideover from '#ui/components/overlays/Slideover.vue';
  import type { DeepPartial, FormErrorEvent, FormSubmitEvent } from '#ui/types';
  import idbValue from "~/utils/idb";

  useHead({
    titleTemplate: (title) => title
      ? `${title} - JTracker`
      : 'J-Tracker'
  });


  //types

  enum Dialog {
    ADD = 'add',
    EDIT = 'edit',
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
      description: null,
    },
    dateApplied: new Date(),
    created: new Date(),
    status: 'applied',
    method: 'online',
    location: undefined,
    lastUpdated: new Date()
  } as DeepPartial<DbApplication>);


  //reactivity
  //stores
  const applicationsStore = stores.useApplicationsStore();
  //html-ref
  //other
  const dialog = ref<Dialog | boolean>();
  const settings = reactive({ dialogStyle: markRaw(USlideover) });
  const applicationState = ref<IDbValue<DbApplication> | ReturnType<typeof defaultApplication>>(defaultApplication());
  const tableRow = ref<IDbValue<DbApplication>[]>([]);
  const page = ref(1);
  const openSettings = ref(false);
  //computed
  const dialogBody = computed(() => {
    switch (dialog.value) {
      case Dialog.ADD: return { header: 'Add application', props: { "modelValue": defaultApplication(), "v-on:update:model-value": (e) => applicationState.value = e, "v-on:submit": addApplication, "v-on:error": onError } };
      case Dialog.EDIT: return { header: 'Edit application', props: { "modelValue": toRaw(selectedRow.value), "v-on:submit": editApplication, "v-on:error": onError } };
      default: return undefined;
    }
  });
  const selectedRow = computed(() => tableRow.value?.[0]);



  const rows = computed(() => {
    return applicationsStore.applications?.slice((page.value - 1) * pageCount, (page.value) * pageCount) ?? [];
  });




  //functions
  async function addApplication(event: FormSubmitEvent<DbApplication>) {
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
    const data = db.application.passthrough().and(idbValue).parse(event.data);
    applicationsStore.editApplication(data);
    dialog.value = false;
  }

  function deleteApplication(application: IDbValue<DbApplication>) {
    if (confirm("Are you sure?"))
      applicationsStore.deleteApplication(application);
    dialog.value = false;
  }
</script>
