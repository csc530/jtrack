<template>
  <UContainer as="main">
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1>applications</h1>
          <ColorScheme>
            <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
          </ColorScheme>
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

  <USlideover v-model="jobSlideover">
    <UCard class="flex flex-col flex-1">
      <template #header>
        <h2>Job Application</h2>
      </template>

      <template #default>
        <UForm ref="form" :schema="db.application" :state="formData" @submit="onSubmit">
          <UFormGroup label="Job title" required name="job.title">
            <UInput v-model="formData.job.title" required />
          </UFormGroup>

          <UFormGroup label="Employer/Company" name="job.company" required>
            <UInput v-model="formData.job.company" required />
          </UFormGroup>

          <UFormGroup label="date applied" required>
            <UInput type="date" :model-value="new Date().toISOString().split('T')[0]" />
          </UFormGroup>

          <UFormGroup label="Application method" name="method">
            <USelect v-model="formData.method" :options="db.applicationMethod.options" />
          </UFormGroup>

          <UFormGroup label="Location" :description="db.application.shape.location.description" name="location" required>
            <UInput v-model="formData.location" list="locations-list" />
            <datalist id="locations-list">
              <option v-for="location in posibleLocations" :key="location">{{ location }}</option>
            </datalist>
          </UFormGroup>

          <UFormGroup label="Job description" name="job.description">
            <UTextarea
              v-model="formData.job.description"
              placeholder="best to straight copy + paste from the job posting..." />
          </UFormGroup>
          <UButton label="Submit" type="submit" />
        </UForm>
      </template>


      <template #footer />
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
  import type { DeepPartial, Form, FormSubmitEvent } from '#ui/types';

  useHead({
    titleTemplate: (title) => title
      ? `${title} - JTracker`
      : 'J-Tracker'
  });

  const applicationsStore  = stores.useApplicationsStore()
  const jobSlideover = ref(false);
  const form = ref<Form<DbApplication>>();
  const formData = reactive<DeepPartial<DbApplication>>({
    job: {
      title: undefined,
      company: undefined,
      description: null,
    },
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
  ]

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
      sortable :true
    },
    {
      label: 'Status',
      key: 'status',
      sortable :true
    },
    {
      label: 'Method',
      key: 'method',
      sortable :true
    },
    {
      label: 'Location',
      key: 'location',
      sortable :true
    },
  ]


  async function onSubmit(event: FormSubmitEvent<DbApplication>) {
    applicationsStore.addApplication(event.data);
    // setDoc(testDoc_chris_myDocRef, event.data);
  }
</script>
