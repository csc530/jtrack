<template>
    <h1>{{ application.job.title }} - {{ application.job.company }}</h1>

    <p>Application method: {{ application.method }} on/at {{ application.location }}</p>

    <section>
        <h2>Description:</h2>
    <p :class="$style.scrollbox">{{ application.job.description }}</p>
    </section>

    <section>
    <h2>Activity log:</h2>
    <ul :class="$style.scrollbox">
        <li v-for="(activity,i) in application.activity" :key="i" :title="activity.details">
            <UButtonGroup>
            <UButton color="cinereous">
                <time :datetime="typeof activity.date === 'string' ? activity.date : activity.date.toISOString()">{{ new Date(activity.date).toLocaleDateString() }}</time> - {{ activity.type }}
                </UButton>
                <UButton label="Delete" color="red" @click="() => $emit('delete:activity',activity)" />
            </UButtonGroup>
        </li>
    </ul>
    </section>

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

<style lang="css" module>
.scrollbox {
    font: serif;
    max-height: 50vh;
    overflow-y: auto;
    padding: 0 1rem;
    margin: 1rem 0;
    border: 1px solid var(--color-gray-300);
    border-radius: 0.5rem;
}
</style>