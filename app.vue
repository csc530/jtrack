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
          <UButton label="Add application" @click="() => jobSlideover = true" />
        </div>
      </template>

      <UTable :rows="applicationsStore.applications" :columns="tableColumns">
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
        <UForm ref="form" :schema="db.application" :state="formData" @error="onError" @submit="onSubmit">
          <UFormGroup label="Job title" required name="job.title">
            <UInput v-model="formData.job.title" required />
          </UFormGroup>

          <UFormGroup label="Employer/Company" name="job.company" required>
            <UInput v-model="formData.job.company" required />
          </UFormGroup>

          <UFormGroup label="date applied" required>
            <UInput type="date" :model-value="formData.dateApplied.toISOString().split('T')[0]" required
              @update:model-value="e => formData.dateApplied = new Date(e)" />
          </UFormGroup>

          <UFormGroup label="Application method" name="method">
            <USelect v-model="formData.method" :options="db.applicationMethod.options" />
          </UFormGroup>

          <UFormGroup label="Location" :description="db.application.shape.location.description" name="location"
            required>
            <UInput v-model="formData.location" list="locations-list" />
            <datalist id="locations-list">
              <option v-for="location in posibleLocations" :key="location">{{ location }}</option>
            </datalist>
          </UFormGroup>

          <UFormGroup label="Job description" name="job.description">
            <UTextarea v-model="formData.job.description"
              placeholder="best to straight copy + paste from the job posting..." />
          </UFormGroup>
          <UButton label="Cancel" type="reset" @click="() => jobSlideover = false" />
          <UButton label="Submit" type="submit" />
        </UForm>
      </template>


      <template #footer />
    </UCard>
  </component>
</template>

<script setup lang="ts">
  import type { DeepPartial, Form, FormErrorEvent, FormSubmitEvent } from '#ui/types';
  import UModal from '#ui/components/overlays/Modal.vue';
  import UDialog from '#ui/components/overlays/Slideover.vue';

  useHead({
    titleTemplate: (title) => title
      ? `${title} - JTracker`
      : 'J-Tracker'
  });

  const dialogStyle = ref(true);
  function getDialogStyle(selected: boolean) {
    return selected ? "modal" : "slideover";
  }
  const applicationsStore = stores.useApplicationsStore();
  const jobSlideover = ref(false);
  const form = ref<Form<DbApplication>>();
  const formData = reactive<DeepPartial<DbApplication>>({
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
  });

  const posibleLocations = [
    "linkedin",
    "indeed",
    "company website",
    "cold-call",
    "cold-email",
  ];

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
    console.log(event.data);
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
</script>
