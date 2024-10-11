<template>
    <h1>{{ application.job.title }} - {{ application.job.company }}</h1>

    <p>Application method: {{ application.method }} on/at {{ application.location }}</p>

    <p>{{ application.job.description }}</p>

    <p>Activity log:</p>
    <ul>
        <li v-for="log in application.logs" :key="log">
            {{ log }}
        </li>
    </ul>

    <UButtonGroup>
        <UButton label="Add an update" @click="() => emits('add:update', application)" />
        <UButton label="Edit" color="yellow" @click="() => emits('edit', application)" />
        <UButton label="Delete" color="red" @click="() => emits('delete', application)" />
    </UButtonGroup>
    <UButton label="Close" color="gray" @click="() => emits('close')" />
</template>
<script setup lang="ts">
    const props = defineProps<{
        application: Application;
    }>();

    type Application = DbApplication | IDbValue<DbApplication>;

    const emits = defineEmits<{
        "add:update": [application: Application],
        edit: [application: Application],
        delete: [application: Application],
        close: [];
    }>();

</script>