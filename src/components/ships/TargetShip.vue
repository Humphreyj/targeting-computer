<script setup>
import { ref } from 'vue'
// Components
// Data
import { shipOptions } from '@/constants/ships.js'
import BasicSelect from '../inputs/BasicSelect.vue'
// const props = defineProps({})
// const emit = defineEmits()
const targetShip = ref(null)
</script>

<template>
    <div class="w-1/3">
        <h2 class="font-display">Target Ship</h2>
        <BasicSelect v-model="targetShip" :options="shipOptions" />
        <div v-if="targetShip" class="mt-4">
            <p class="text-sm">Selected Ship: {{ targetShip?.model }}</p>
            <p class="text-sm">PDC Count: {{ targetShip?.pdcCount }}</p>
        </div>
    </div>
</template>
