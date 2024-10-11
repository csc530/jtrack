<template>
  <UContainer as="main">
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1>applications</h1>
          <UFormGroup label="dialog style" :description="getDialogStyle(dialogStyle)">
            <UToggle v-model="dialogStyle" />
          </UFormGroup>
          <UButton disabled label="Export" @click="() => console.log('export')" />
          <UButton disabled label="Import" @click="() => console.log('import')" />
          <UButton label="Reset" color="red" @click="clearApplications" />
          <UButton label="Add application" @click="addApplication" />
        </div>
      </template>

      <UTable v-model="tableRow" :rows="applicationsStore.applications" :columns="tableColumns" @select="onRowSelect">
        <template #empty-state>
          <p class="italic text-sm">No job applications!</p>
          <UButton label="Add application" @click="() => jobSlideover = true" />
        </template>
      </UTable>
    </UCard>
  </UContainer>

  <component :is="!dialogStyle ? UDialog : UModal" v-model="jobSlideover">
    <UCard class="flex flex-col flex-1">
      <template #header>
        <h2>Job Application</h2>
      </template>

      <template #default>
        <ApplicationForm v-model="applicationState" @submit="onSubmit" @error="onError" />
      </template>


      <template #footer />
    </UCard>
  </component>

  <component :is="!dialogStyle ? UDialog : UModal" v-model="editModal">
    <UCard class="flex flex-col flex-1">
      <template #header>
        <h2>Edit application</h2>
      </template>

      <template #default>
        <ApplicationForm v-model="applicationState" @submit="editApplication" @error="onError" />
      </template>
    </UCard>
  </component>
</template>

<script setup lang="ts">
  import type { DeepPartial, Form, FormErrorEvent, FormSubmitEvent } from '#ui/types';
  import UModal from '#ui/components/overlays/Modal.vue';
  import UDialog from '#ui/components/overlays/Slideover.vue';
import idbValue from "~/utils/idb";

  useHead({
    titleTemplate: (title) => title
      ? `${title} - JTracker`
      : 'J-Tracker'
  });

  const dialogStyle = ref(true);
  function getDialogStyle(selected: boolean) {
    return selected ? "modal" : "slideover";
  }
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
  const applicationState = ref<IDbValue<DbApplication> | ReturnType<typeof defaultApplication>>(defaultApplication());
  const tableRow = ref<IDbValue<DbApplication>[]>([]);
  const applicationsStore = stores.useApplicationsStore();
  const jobSlideover = ref(false);
  const editModal = ref(false);
  const form = ref<Form<DbApplication>>();




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


  async function onSubmit(event: FormSubmitEvent<DbApplication>) {
    applicationsStore.addApplication(event.data);
    jobSlideover.value = false;
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
    applicationState.value =toRaw(row)
    editModal.value = true;
  }

  function editApplication(event: FormSubmitEvent<IDbValue<DbApplication  > >) {
    const data = db.application.passthrough().and(idbValue).parse(event.data)
      applicationsStore.editApplication(data);
    editModal.value = false;
  }

  function addApplication() {
    applicationState.value = defaultApplication();
    jobSlideover.value = true;
  }
</script>
