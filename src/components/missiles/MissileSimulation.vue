<script setup>
import { ref, computed, onUnmounted } from 'vue'
import Button from '../UI/Button.vue'

import MissileProgress from './MissileProgress.vue'

// Components
const props = defineProps({
    distance: {
        type: Number,
        default: 0,
    },
    selectedMissile: {
        type: Object,
        default: () => ({}),
    },
    selectedTorpedo: {
        type: Object,
        default: () => ({}),
    },
})

// State management for missile launch
const isLaunched = ref(false)
const launchTime = ref(null)
const torpedoLaunchTime = ref(null)
const missileDelayedLaunch = ref(false)
const missileScheduledTime = ref(null)
const currentTime = ref(Date.now())

// Update current time every 100ms for reactive countdown
let timeInterval = null
const startTimeTracking = () => {
    timeInterval = setInterval(() => {
        currentTime.value = Date.now()
    }, 100)
}

const stopTimeTracking = () => {
    if (timeInterval) {
        clearInterval(timeInterval)
        timeInterval = null
    }
}

// Computed property for countdown display
const missileCountdown = computed(() => {
    if (!missileDelayedLaunch.value || !missileScheduledTime.value) return 0
    const remaining = Math.max(
        0,
        (missileScheduledTime.value - currentTime.value) / 1000
    )
    return Math.ceil(remaining)
})

// Cleanup on unmount
onUnmounted(() => {
    stopTimeTracking()
})

const launchMissiles = () => {
    console.log('Missiles launched!')
    isLaunched.value = true
    launchTime.value = Date.now()
}

const launchMissileScreen = () => {
    console.log('Launching missile screen sequence...')

    // Validate we have both missile and torpedo selected
    if (!props.selectedMissile?.name || !props.selectedTorpedo?.name) {
        console.warn(
            'Both missile and torpedo must be selected for missile screen'
        )
        return
    }

    // Get time to target for both ordnance (in seconds)
    const missileTimeToTarget = parseFloat(props.selectedMissile.timeToTarget)
    const torpedoTimeToTarget = parseFloat(props.selectedTorpedo.timeToTarget)

    if (
        missileTimeToTarget === 'N/A' ||
        torpedoTimeToTarget === 'N/A' ||
        isNaN(missileTimeToTarget) ||
        isNaN(torpedoTimeToTarget)
    ) {
        console.warn('Invalid time to target values')
        return
    }

    // Calculate delay: missiles should arrive 0.1 seconds before torpedo
    const impactTimeDifference = 0.1 // seconds
    const missileDelay =
        torpedoTimeToTarget - missileTimeToTarget - impactTimeDifference

    console.log(`Torpedo time to target: ${torpedoTimeToTarget}s`)
    console.log(`Missile time to target: ${missileTimeToTarget}s`)
    console.log(`Calculated missile delay: ${missileDelay}s`)

    if (missileDelay <= 0) {
        console.warn(
            'Missile is too slow compared to torpedo for this strategy'
        )
        // Still execute but missile will launch immediately
    }

    // Launch torpedo immediately
    isLaunched.value = true
    torpedoLaunchTime.value = Date.now()

    // Schedule missile launch after calculated delay
    const delayMs = Math.max(0, missileDelay * 1000)
    missileDelayedLaunch.value = true
    missileScheduledTime.value = Date.now() + delayMs
    startTimeTracking()

    setTimeout(() => {
        launchTime.value = Date.now()
        missileDelayedLaunch.value = false
        missileScheduledTime.value = null
        stopTimeTracking()
        console.log('Missiles launched with calculated delay!')
    }, delayMs)
}

const resetSimulation = () => {
    isLaunched.value = false
    launchTime.value = null
    torpedoLaunchTime.value = null
    missileDelayedLaunch.value = false
    missileScheduledTime.value = null
    stopTimeTracking()
}
</script>

<template>
    <div class="w-full border">
        <Button
            text="Launch Missile"
            @click="launchMissiles"
            :disabled="isLaunched || !selectedMissile.name"
        />
        <Button
            text="Launch Missile Screen"
            @click="launchMissileScreen"
            :disabled="
                isLaunched || !selectedMissile.name || !selectedTorpedo.name
            "
        />
        <Button
            v-if="isLaunched"
            text="Reset Simulation"
            @click="resetSimulation"
            :disabled="!isLaunched"
        />

        <!-- Status indicator for delayed missile launch -->
        <div
            v-if="missileDelayedLaunch"
            class="p-2 mt-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-400 rounded"
        >
            🚀 Torpedo launched! Missiles launching in
            {{ missileCountdown }} seconds...
        </div>

        <MissileProgress
            :distance="distance"
            :ordnance="selectedMissile"
            :isLaunched="isLaunched && !!launchTime"
            :launchTime="launchTime"
            @missile-complete="isLaunched = false"
            @reset-simulation="resetSimulation"
        />
        <MissileProgress
            :distance="distance"
            :ordnance="selectedTorpedo"
            :isLaunched="isLaunched && !!torpedoLaunchTime"
            :launchTime="torpedoLaunchTime || launchTime"
            @missile-complete="isLaunched = false"
            @reset-simulation="resetSimulation"
        />
    </div>
</template>
