<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
// Components
const props = defineProps({
    progress: {
        type: Number,
        default: 0,
    },
    text: {
        type: String,
        default: '',
    },
    error: {
        type: Boolean,
        default: false,
    },
    timeout: {
        type: Number,
        default: null,
    },
})
const emit = defineEmits(['remove-item', 'handle-error'])

const progress = ref(props.progress)
const progressBarStyle = computed(() => {
    return {
        width: `${progress.value}%`,
    }
})
// time is a random number between 50 and 250
const timeout = ref(Math.floor(Math.random() * (150 - 50 + 1)) + 10)

// function to mock error with a 80% chance
const mockError = () => {
    return Math.random() < 0.3
}

watchEffect(() => {
    // increment progress by 1 every 100ms
    let hasError = mockError()
    if (hasError) {
        timeout.value = 125
        emit('handle-error')
        return
    }
    const interval = setInterval(() => {
        progress.value++
        if (progress.value === 100) {
            emit('remove-item')
            clearInterval(interval)
        }
    }, timeout.value)
})
</script>

<template>
    <div
        class="w-64 h-12 overflow-hidden border border-gray-300 rounded-lg flex-ic-js progress"
    >
        <div
            class="h-full rounded-lg indeterminate"
            :class="error ? 'bg-red-500' : 'bg-blue-500'"
            :style="progressBarStyle"
        >
            <div class="h-full gap-2 px-2 text-white flex-ic-jc w-max">
                <p>{{ text }}</p>
                <p>{{ progress }}%</p>
            </div>
        </div>
    </div>
</template>
