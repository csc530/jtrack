<template>
    <UForm
:schema="db.activity" :state="model" @error="e => $emit('error', e)" @submit="e => $emit('submit', e)"
        @cancel="() => $emit('cancel')">
        <UFormGroup label="Type" required name="type">
            <USelect v-model="model.type" :options="db.activity.shape.type.options" required />
        </UFormGroup>

        <UFormGroup label="Activity" required name="activity">
            <UInput v-model="model.activity" required />
        </UFormGroup>

        <UFormGroup label="Date" required>
            <!-- todo: add validate to be after application date -->
            <UInput :model-value="typeof model.date === 'string' ? model.date : model.date.toISOString().split('T')[0]" type="date" required @update:model-value="e => model.date = e" />
        </UFormGroup>

        <UFormGroup label="Notes" name="notes">
            <UTextarea v-model="model.details" />
        </UFormGroup>

        <UButton label="Cancel" type="reset" @click="() => $emit('cancel')" />
        <UButton label="Submit" type="submit" />
    </UForm>
</template>

<script setup lang="ts" generic="T extends DeepPartial<DbActivity>">
    import type { FormError, FormSubmitEvent } from "#ui/types";

    const emits = defineEmits<{
        error: [error: FormError],
        submit: [data: FormSubmitEvent<T>],
        cancel: [],
    }>();



    const model = defineModel<T>({ required: true, });
</script>