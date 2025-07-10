<script setup>
import { ref, computed, onUnmounted } from 'vue'
import Button from '../UI/Button.vue'

import MissileProgress from './MissileProgress.vue'

// Components
const props = defineProps({
    ship: {
        type: Object,
        default: () => ({}),
    },
    distance: {
        type: Number,
        default: 0,
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

// Computed property to check if we have valid ordnance selected
const hasValidOrdnance = computed(() => {
    const hasActiveMissiles = props.ship.missileLaunchers?.some(
        (launcher) => launcher.selectedMissile?.name
    )
    const hasTorpedo = props.selectedTorpedo?.name
    return hasActiveMissiles && hasTorpedo
})

// Cleanup on unmount
onUnmounted(() => {
    stopTimeTracking()
})

const launchMissileScreen = () => {
    console.log('Launching missile screen sequence...')

    // Validate we have missiles and torpedo selected
    const activeLaunchers =
        props.ship.missileLaunchers?.filter(
            (launcher) => launcher.selectedMissile?.name
        ) || []

    if (!activeLaunchers.length || !props.selectedTorpedo?.name) {
        console.warn(
            'At least one missile and torpedo must be selected for missile screen'
        )
        return
    }

    // Get time to target for torpedo (in seconds)
    const torpedoTimeToTarget = parseFloat(props.selectedTorpedo.timeToTarget)

    if (torpedoTimeToTarget === 'N/A' || isNaN(torpedoTimeToTarget)) {
        console.warn('Invalid torpedo time to target value')
        return
    }

    // Find the fastest missile to use for timing calculation
    let fastestMissileTime = Infinity
    activeLaunchers.forEach((launcher) => {
        const missileTimeToTarget = parseFloat(
            launcher.selectedMissile.timeToTarget
        )
        if (
            !isNaN(missileTimeToTarget) &&
            missileTimeToTarget < fastestMissileTime
        ) {
            fastestMissileTime = missileTimeToTarget
        }
    })

    if (fastestMissileTime === Infinity) {
        console.warn('No valid missile time to target found')
        return
    }

    // Calculate delay: missiles should arrive 0.1 seconds before torpedo
    const impactTimeDifference = 0.1 // seconds
    const missileDelay =
        torpedoTimeToTarget - fastestMissileTime - impactTimeDifference

    console.log(`Torpedo time to target: ${torpedoTimeToTarget}s`)
    console.log(`Fastest missile time to target: ${fastestMissileTime}s`)
    console.log(`Calculated missile delay: ${missileDelay}s`)

    if (missileDelay <= 0) {
        console.warn(
            'Missiles are too slow compared to torpedo for this strategy'
        )
        // Still execute but missiles will launch immediately
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
    <div class="w-full">
        <div class="w-full flex-ic-jc">
            <Button
                text="Launch Missile Screen"
                @click="launchMissileScreen"
                :disabled="isLaunched || !hasValidOrdnance"
                button-class="my-2"
            />
            <Button
                v-if="isLaunched"
                text="Reset Simulation"
                @click="resetSimulation"
                :disabled="!isLaunched"
            />
        </div>

        <!-- Status indicator for delayed missile launch -->
        <div
            v-if="missileDelayedLaunch"
            class="p-2 mt-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-400 rounded"
        >
            🚀 Torpedo launched! Missiles launching in
            {{ missileCountdown }} seconds...
        </div>
        <div class="w-full gap-3 flex-col-is-jc">
            <div
                v-for="launcher in ship.missileLaunchers"
                :key="launcher.id"
                class="w-full"
            >
                <MissileProgress
                    v-if="launcher.selectedMissile.name"
                    :distance="distance"
                    :ordnance="launcher.selectedMissile"
                    :isLaunched="isLaunched && !!launchTime"
                    :launchTime="launchTime"
                    @missile-complete="isLaunched = false"
                    @reset-simulation="resetSimulation"
                />
            </div>

            <MissileProgress
                v-if="selectedTorpedo.name"
                :distance="distance"
                :ordnance="selectedTorpedo"
                :isLaunched="isLaunched && !!torpedoLaunchTime"
                :launchTime="torpedoLaunchTime || launchTime"
                @missile-complete="isLaunched = false"
                @reset-simulation="resetSimulation"
            />
        </div>
    </div>
</template>
