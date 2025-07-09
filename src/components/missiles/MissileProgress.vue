<script setup>
import { ref, computed, watch, watchEffect, onUnmounted } from 'vue'
import BasicSelect from '../inputs/BasicSelect.vue'

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

const missileSpeed = computed(() => {
    return props.ordnance?.missile?.linearSpeed || 0
})

const progress = ref(0)
const currentTime = ref(0)
let progressInterval = null
const missileCount = ref(1)
const missileCountOptions = ref([
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
])

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

watchEffect(() => {
    if (props.ordnance) {
        console.log(missileSpeed.value)
    }
})
</script>

<template>
    <div class="w-full p-4 border rounded-lg bg-gray-50">
        <div class="mb-4">
            <div class="gap-3 flex-ic-js">
                <h3 class="text-lg font-semibold text-gray-800 w-44">
                    {{ ordnance.name || 'No Missile Selected' }}
                </h3>
                <BasicSelect
                    v-model="missileCount"
                    :options="missileCountOptions"
                    container-class="w-24"
                />
            </div>
            <h2 class="text-gray-800">{{ missileSpeed }} m/s</h2>

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
                v-for="i in Array(missileCount)"
                :key="i"
                class="w-full h-8 my-1 overflow-hidden bg-gray-200 border rounded-lg"
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
