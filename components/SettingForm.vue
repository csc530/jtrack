<template>
    <UForm
:state="model" :validate="validate" :schema="schema" @error="e => $emit('error', e)"
        @submit="e => $emit('submit', e)">
        <p>Settings</p>
        <UFormGroup label="dialog style" :description="model.dialogStyle === UModal ? 'modal' : 'slideover'">
            <UToggle
:model-value="model.dialogStyle === UModal"
                @update:model-value="e => model.dialogStyle = markRaw(e ? UModal : USlideover)" />
        </UFormGroup>
        <UButton label="Save" type="submit" />
    </UForm>
</template>

<script setup lang="ts">
    import { z } from "zod";
    import UModal from "#ui/components/overlays/Modal.vue";
    import USlideover from "#ui/components/overlays/Slideover.vue";
    import type { FormError, FormSubmitEvent } from "#ui/types";

    const emits = defineEmits<{
        error: [error: FormError],
        submit: [data: FormSubmitEvent<Schema>],
    }>();


    const schema = z.object({
        dialogStyle: z.union([z.object(UModal), z.object(USlideover)]).default(UModal),
    });
    type Schema = z.infer<typeof schema>;
    const model = defineModel<Schema>({ required: true });

    function validate(state: Schema): FormError[] {
        return [];
    }
</script>