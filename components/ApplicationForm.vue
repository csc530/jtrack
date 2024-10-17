<template>
    <UForm ref="form" :schema="db.application" :state="model" @input="update" @error="e => $emit('error', e)" @submit="submit">
        <UFormGroup label="Job title" required name="job.title">
            <UInput v-model="model.job.title" required />
        </UFormGroup>

        <UFormGroup label="Employer/Company" name="job.company" required>
            <UInput v-model="model.job.company" required />
        </UFormGroup>

        <UFormGroup label="Date applied" required>
            <UInput
type="date" :model-value="model.dateApplied instanceof Date ? model.dateApplied.toISOString().split('T')[0]:model.dateApplied?.toString()" required
                @update:model-value="e => model.dateApplied = `${e}T00:00:00.000Z`" />
        </UFormGroup>

        <UFormGroup label="Application method" name="method" required>
            <USelect v-model="model.method" :options="db.applicationMethod.options" required/>
        </UFormGroup>

        <UFormGroup label="Location" :description="db.application.shape.location.description" name="location" required>
            <UInput v-model.trim="model.location" type="text" list="locations-list"  required placeholder="Glassdoor, In-store, conversation, etc."/>
            <datalist id="locations-list">
                <option v-for="location in possibleLocations" :key="location">{{ location }}</option>
            </datalist>
        </UFormGroup>

        <UFormGroup label="Job description" name="job.description">
            <UTextarea v-model.trim="model.job.description" placeholder="best to straight copy + paste from the job posting..."  />
        </UFormGroup>

        <UInput type="hidden" :model-value="model.lastUpdated?.toString()" @update:model-value="e => model.lastUpdated = new Date(e).toISOString()" />
        <UButton label="Cancel" type="reset" @click="() => $emit('cancel')" />
        <UButton label="Submit" type="submit" />
    </UForm>
</template>

<script setup lang="ts" generic="T extends DeepPartial<DbApplication>">
    import type {  FormErrorEvent, FormSubmitEvent } from '#ui/types';
    const possibleLocations = [
        "linkedin",
        "indeed",
        "company website",
        "cold-call",
        "cold-email",
    ];

    // editing is too live save initial state in cancel
    const model = defineModel<T>({ required: true });


    const emits = defineEmits<{
        error: [event: FormErrorEvent];
        submit: [event: FormSubmitEvent<T>];
        cancel: [];
    }>();

    function submit(event: FormSubmitEvent<T>) {
        emits('submit', event);
    }

    function update(){
        model.value.lastUpdated = new Date().toISOString();
    }
</script>