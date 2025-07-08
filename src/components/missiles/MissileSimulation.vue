<script setup>
import { ref } from 'vue'
import Button from '../UI/Button.vue'
import MissileDataCard from './MissileDataCard.vue'
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

const launchMissiles = () => {
    console.log('Missiles launched!')
    isLaunched.value = true
    launchTime.value = Date.now()
}

const resetSimulation = () => {
    isLaunched.value = false
    launchTime.value = null
}
</script>

<template>
    <div class="w-full border">
        <section class="flex-ic-js">
            <MissileDataCard
                v-if="selectedMissile.name"
                :missile="selectedMissile"
                :distance="distance"
            />
            <MissileDataCard
                v-if="selectedTorpedo.name"
                :missile="selectedTorpedo"
                :distance="distance"
            />
        </section>
        <Button
            text="Launch Missile"
            @click="launchMissiles"
            :disabled="isLaunched || !selectedMissile.name"
        />
        <Button
            v-if="isLaunched"
            text="Reset Simulation"
            @click="resetSimulation"
            :disabled="!isLaunched"
        />
        <MissileProgress
            :distance="distance"
            :ordnance="selectedMissile"
            :isLaunched="isLaunched"
            :launchTime="launchTime"
            @missile-complete="isLaunched = false"
            @reset-simulation="resetSimulation"
        />
        <MissileProgress
            :distance="distance"
            :ordnance="selectedTorpedo"
            :isLaunched="isLaunched"
            :launchTime="launchTime"
            @missile-complete="isLaunched = false"
            @reset-simulation="resetSimulation"
        />
    </div>
</template>
