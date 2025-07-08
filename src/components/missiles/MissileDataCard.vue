<script setup>
import { computed } from 'vue'
// Components
const props = defineProps({
    missile: {
        type: Object,
        required: true,
    },
    distance: {
        type: Number,
        default: 0,
    },
})
// const emit = defineEmits()
const timeToTarget = computed(() => {
    if (props.distance === 0) return 'N/A'
    return (props.distance / props.missile.missile.linearSpeed).toFixed(2)
})
</script>

<template>
    <div
        class="p-4 border rounded-lg shadow-md flex-col-is-jc w-max max-w-[20rem]"
    >
        <h2>{{ props.missile.name }}</h2>
        <p>{{ props.missile.missile.linearSpeed }}</p>
        <p>Time to Target: {{ timeToTarget }} seconds</p>
    </div>
</template>
