<template>
    <UForm ref="form" :schema="db.application" :state="state" @error="e => $emit('error', e)" @submit="submit">
        <UFormGroup label="Job title" required name="job.title">
            <UInput v-model="state.job.title" required />
        </UFormGroup>

        <UFormGroup label="Employer/Company" name="job.company" required>
            <UInput v-model="state.job.company" required />
        </UFormGroup>

        <UFormGroup label="date applied" required>
            <UInput
type="date" :model-value="state.dateApplied.toISOString().split('T')[0]" required
                @update:model-value="e => state.dateApplied = new Date(e)" />
        </UFormGroup>

        <UFormGroup label="Application method" name="method">
            <USelect v-model="state.method" :options="db.applicationMethod.options" />
        </UFormGroup>

        <UFormGroup label="Location" :description="db.application.shape.location.description" name="location" required>
            <UInput v-model="state.location" list="locations-list" />
            <datalist id="locations-list">
                <option v-for="location in possibleLocations" :key="location">{{ location }}</option>
            </datalist>
        </UFormGroup>

        <UFormGroup label="Job description" name="job.description">
            <UTextarea
v-model="state.job.description"
                placeholder="best to straight copy + paste from the job posting..." />
        </UFormGroup>
        <UButton label="Cancel" type="reset" @click="() => $emit('cancel')" />
        <UButton label="Submit" type="submit" />
    </UForm>
</template>

<script setup lang="ts" generic="T extends DbApplication">
    import type { DeepPartial, Form, FormErrorEvent, FormSubmitEvent } from '#ui/types';
    const possibleLocations = [
        "linkedin",
        "indeed",
        "company website",
        "cold-call",
        "cold-email",
    ];

    // editing is too live save initial state in cancel
    const state = defineModel<DeepPartial<T>>({required: true});
    const localState = ref({
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

    // const state = computed({
    //     get() {
    //         console.log("get", model.value);
    //         return (model.value);
    //     },
    //     set(newValue) {
    //         console.log("set", newValue);
    //         // localState.value = newValue;
    //     },
    // });


    const emits = defineEmits<{
        error: [event: FormErrorEvent];
        submit: [event: FormSubmitEvent<T>];
        cancel: [];
    }>();

    function submit(event: FormSubmitEvent<T>) {
        emits('submit', event);
    }
</script>