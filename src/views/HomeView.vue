<script setup>
import { ref, watch } from 'vue'
// Components
import MissileSelect from '@/components/inputs/MissileSelect.vue'
// Data
import { missiles, torpedoes } from '@/stores/missiles.js'
import { distanceOptions } from '@/constants/distance.js'
import SearchSelect from '@/components/inputs/SearchSelect.vue'
import MissileSimulation from '@/components/missiles/MissileSimulation.vue'

const selectedMissile = ref()
const selectedTorpedo = ref()
const distanceToTarget = ref(10000)
const distanceToTargetOptions = distanceOptions
const timeToTarget = (missile, distance) => {
    if (distance === 0) return 'N/A'
    return (distance / missile.linearSpeed).toFixed(2)
}
watch(
    [selectedMissile, selectedTorpedo, distanceToTarget],
    ([missile, torpedo, distance]) => {
        if (missile) {
            selectedMissile.value.timeToTarget = timeToTarget(
                missile.missile,
                distance
            )
            console.log(
                `Missile: ${selectedMissile.value.name}, Time to Target: ${selectedMissile.value.timeToTarget} seconds`
            )
        }
        if (torpedo) {
            selectedTorpedo.value.timeToTarget = timeToTarget(
                torpedo.missile,
                distance
            )
            console.log(
                `Torpedo: ${selectedTorpedo.value.name}, Time to Target: ${selectedTorpedo.value.timeToTarget} seconds`
            )
        }
    }
)
</script>

<template>
    <section
        class="w-10/12 max-w-[75rem] h-screen mx-auto primary-text px-2 py-4 font-display flex-col-ic-js gap-3"
    >
        <div class="w-2/3 gap-3 flex-is-jc">
            <SearchSelect
                v-model.number="distanceToTarget"
                label="Distance to Target"
                :options="distanceToTargetOptions"
                inputType="number"
                placeholder="Select Distance"
                label-class="text-white"
            />
            <MissileSelect
                v-model="selectedMissile"
                label="Select a Missile"
                :options="missiles"
            />
            <MissileSelect
                v-model="selectedTorpedo"
                label="Select a Torpedo"
                :options="torpedoes"
            />
        </div>
        <MissileSimulation
            :selected-missile="selectedMissile"
            :selected-torpedo="selectedTorpedo"
            :distance="distanceToTarget"
        />
    </section>
</template>
