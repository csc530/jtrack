<template>
    <h1>{{ application.job.title }} - {{ application.job.company }}</h1>

    <p>Application method: {{ application.method }} on/at {{ application.location }}</p>

    <p>{{ application.job.description }}</p>

    <p>Activity log:</p>
    <ul>
        <li v-for="(activity,i) in application.activity" :key="i" :title="activity.details">
            <UButtonGroup>
            <UButton color="cinereous">
                <time :datetime="typeof activity.date === 'string' ? activity.date : activity.date.toISOString()">{{ new Date(activity.date).toLocaleDateString() }}</time> - {{ activity.type }}
                </UButton>
                <UButton label="Delete" color="red" @click="() => $emit('delete:activity',activity)" />
            </UButtonGroup>
        </li>
    </ul>

    <UDivider size="2xs" type="dashed" class="my-2" />

    <UButtonGroup>
        <UButton label="Add an update" @click="() => emits('add:update', application)" />
        <UButton label="Edit" color="yellow" @click="() => emits('edit', application)" />
        <UButton label="Delete" color="red" @click="() => emits('delete:application', application)" />
    </UButtonGroup>
    <UButton label="Close" color="gray" @click="() => emits('close')" />
</template>
<script setup lang="ts" generic="T extends DbApplication">
    const props = defineProps<{
        application: Application;
    }>();

    type Application = T

    const emits = defineEmits<{
        "add:update": [application: Application],
        edit: [application: Application],
        "delete:application": [application: Application],
        "delete:activity": [activity: DbActivity],
        close: [];
    }>();
</script>