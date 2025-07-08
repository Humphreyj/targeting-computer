<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
    distance: {
        type: Number,
        default: 0,
    },
    ordnance: {
        type: Object,
        default: () => ({}),
    },
    isLaunched: {
        type: Boolean,
        default: false,
    },
    launchTime: {
        type: Number,
        default: null,
    },
})

const emit = defineEmits(['missile-complete', 'reset-simulation'])

const progress = ref(0)
const currentTime = ref(0)
let progressInterval = null

// Calculate progress based on elapsed time vs time to target
const updateProgress = () => {
    if (
        !props.isLaunched ||
        !props.launchTime ||
        !props.ordnance.timeToTarget ||
        props.ordnance.timeToTarget === 'N/A'
    ) {
        progress.value = 0
        currentTime.value = 0
        return
    }

    const elapsed = (Date.now() - props.launchTime) / 1000 // seconds
    currentTime.value = elapsed
    const timeToTarget = parseFloat(props.ordnance.timeToTarget)

    progress.value = Math.min((elapsed / timeToTarget) * 100, 100)

    if (progress.value >= 100) {
        clearInterval(progressInterval)
        // Don't automatically reset - let the user reset manually
    }
}

// Watch for launch state changes
watch(
    () => props.isLaunched,
    (newValue) => {
        if (
            newValue &&
            props.ordnance.timeToTarget &&
            props.ordnance.timeToTarget !== 'N/A' &&
            parseFloat(props.ordnance.timeToTarget) > 0
        ) {
            // Start progress tracking
            progressInterval = setInterval(updateProgress, 50) // Update every 50ms for smooth animation
        } else {
            // Reset progress
            if (progressInterval) {
                clearInterval(progressInterval)
                progressInterval = null
            }
            progress.value = 0
            currentTime.value = 0
        }
    }
)

// Computed values for display
const progressBarStyle = computed(() => ({
    width: `${progress.value}%`,
}))

const remainingTime = computed(() => {
    if (
        !props.ordnance.timeToTarget ||
        props.ordnance.timeToTarget === 'N/A' ||
        !props.isLaunched
    )
        return 0
    const timeToTarget = parseFloat(props.ordnance.timeToTarget)
    return Math.max(timeToTarget - currentTime.value, 0)
})

const formatTime = (seconds) => {
    return seconds.toFixed(1)
}

// Cleanup on unmount
onUnmounted(() => {
    if (progressInterval) {
        clearInterval(progressInterval)
    }
})
</script>

<template>
    <div class="w-full p-4 border rounded-lg bg-gray-50">
        <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
                {{ ordnance.name || 'No Missile Selected' }}
            </h3>
            <div class="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                <div>Distance: {{ distance }}m</div>
                <div v-if="ordnance.timeToTarget">
                    Time to Target:
                    {{
                        ordnance.timeToTarget === 'N/A'
                            ? 'N/A'
                            : formatTime(parseFloat(ordnance.timeToTarget)) +
                              's'
                    }}
                </div>
                <div v-if="isLaunched">
                    Elapsed: {{ formatTime(currentTime) }}s
                </div>
                <div v-if="isLaunched">
                    Remaining: {{ formatTime(remainingTime) }}s
                </div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="ordnance.name" class="mb-4">
            <div
                class="w-full h-8 overflow-hidden bg-gray-200 border rounded-lg"
            >
                <div
                    class="flex items-center justify-center h-full text-sm font-medium text-white transition-all duration-75 ease-linear rounded-lg"
                    :class="isLaunched ? 'bg-red-500' : 'bg-gray-400'"
                    :style="progressBarStyle"
                >
                    <span v-if="progress > 10"
                        >{{ Math.round(progress) }}%</span
                    >
                </div>
            </div>
            <div class="mt-2 text-xs text-center text-gray-500">
                {{ isLaunched ? 'Missile in Flight' : 'Ready to Launch' }}
            </div>
        </div>

        <!-- Status Display -->
        <div v-if="!ordnance.name" class="py-8 text-center text-gray-500">
            Select a missile to begin simulation
        </div>
    </div>
</template>
