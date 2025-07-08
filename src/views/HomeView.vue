<script setup>
import { ref } from 'vue'
import MissileSelect from '@/components/inputs/MissileSelect.vue'
// Data
import { missiles, torpedoes } from '@/stores/missiles.js'
import SearchSelect from '@/components/inputs/SearchSelect.vue'

const selectedMissile = ref()
const selectedTorpedo = ref()
const distanceToTarget = ref(0)
const distanceToTargetOptions = [
    { value: 0, label: '0' },
    { value: 1000, label: '1000' },
    { value: 2000, label: '2000' },
    { value: 3000, label: '3000' },
    { value: 4000, label: '4000' },
    { value: 5000, label: '5000' },
]
</script>

<template>
    <section
        class="w-10/12 max-w-[75rem] h-screen mx-auto primary-text px-2 font-display flex-col-ic-js"
    >
        <div class="w-2/3 gap-3 flex-is-jc">
            <SearchSelect
                v-model.number="distanceToTarget"
                label="Distance to Target"
                :options="distanceToTargetOptions"
                inputType="number"
                placeholder="Select Distance"
            />
            <MissileSelect
                v-model="selectedMissile"
                label="Select a Missile"
                :options="missiles"
                :distance="distanceToTarget"
            />
            <MissileSelect
                v-model="selectedTorpedo"
                label="Select a Torpedo"
                :options="torpedoes"
                :distance="distanceToTarget"
            />
        </div>
    </section>
</template>
