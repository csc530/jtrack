<template>
  <UContainer as="main">
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1>Welcome to Nuxt UI Starter</h1>
          <ColorScheme>
            <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
          </ColorScheme>
        </div>
      </template>

      <UTable>
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
        <UForm ref="form" :schema="firestore.application" :state="formData" @submit="onSubmit">
          <UFormGroup label="Job title" required name="job.title">
            <UInput v-model="formData.job.title" required />
          </UFormGroup>

          <UFormGroup label="Employer/Company" name="job.company">
            <UInput v-model="formData.job.company" />
          </UFormGroup>

          <UFormGroup label="date applied">
            <UInput disabled type="date" :model-value="new Date().toISOString().split('T')[0]" />
          </UFormGroup>

          <UFormGroup label="Application method" name="method">
            <USelect v-model="formData.method" :options="firestore.applicationMethod.options" />
          </UFormGroup>

          <UFormGroup label="Location" :description="firestore.application.shape.location.description" name="location">
            <UInput v-model="formData.location" />
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
import { collection, doc, setDoc } from "firebase/firestore";
  useHead({
    titleTemplate: (title) => title
      ? `${title} - JTracker`
      : 'J-Tracker'
  });
  const db = useFirestore();
  const jobsCollectionRef = collection(db, 'jobs');
  const testDoc_chris_myDocRef = doc(db, 'test', 'chris');

  const jobSlideover = ref(false);
  const form = ref<Form<DbApplication>>();
  const formData = reactive<DeepPartial<DbApplication>>({
    job: {
      title: undefined,
      company: undefined,
      description: undefined,
    },
    created: new Date(),
    status: 'applied',
    method: 'online',
    location: undefined,
    lastUpdated: new Date()
  });



  async function onSubmit(event: FormSubmitEvent<DbApplication>) {
    setDoc(testDoc_chris_myDocRef, event.data);
  }
</script>
