<script setup>
import ShipComponent from '@/components/ships/ShipComponent.vue'
import TargetShip from '@/components/ships/TargetShip.vue'
</script>

<template>
    <section
        class="w-10/12 max-w-[75rem] h-screen mx-auto primary-text px-2 py-4 font-display flex-is-jb gap-3"
    >
        <ShipComponent />
        <TargetShip />
    </section>
</template>
