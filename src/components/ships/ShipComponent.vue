<script setup>
import { ref, computed, watch } from 'vue'
// Components
import MissileSelect from '@/components/inputs/MissileSelect.vue'
import SearchSelect from '@/components/inputs/SearchSelect.vue'
import MissileSimulation from '@/components/missiles/MissileSimulation.vue'
// Data
import { missiles, torpedoes } from '@/stores/missiles.js'
import { distanceOptions } from '@/constants/distance.js'
const props = defineProps({
    ship: {
        type: Object,
        default: () => ({
            manufacturer: 'RSI',
            model: 'Polaris',
            missileSize: 3,
            torpedoSize: 10,
            missileLaunchers: [
                {
                    id: 1,
                    name: 'Forward Launcher',
                    selectedMissile: {
                        type: 'Missile',
                        subType: 'Missile',
                        size: 3,
                        grade: 'A',
                        name: 'Arrester III',
                        shortName: 'Arrstr III',
                        description:
                            'Using cross section targeting to hunt for its prey, the Firestorm Arrester proximity missile makes quick work of enemies caught in the crosshairs.',
                        physics: {
                            mass: 119,
                            temperature: {
                                enable: false,
                                initialTemperature: -1,
                                coolingEqualizationMultiplier: true,
                                internalTemperatureGeneration: false,
                                signatureParams: {
                                    enable: false,
                                    minimumTemperatureForIR: 250,
                                    temperatureToIR: 6,
                                },
                                itemResourceParams: {
                                    minOperatingTemperature: 0,
                                    minCoolingTemperature: 300,
                                    enableOverheat: false,
                                    overheatTemperature: 450,
                                    overheatWarningTemperature: 370,
                                    overheatRecoveryTemperature: 350,
                                },
                            },
                        },
                        health: {
                            hp: 50,
                            damageResistanceMultiplier: {
                                physical: 1,
                                energy: 1,
                                distortion: 1,
                                thermal: 1,
                                biochemical: 0,
                                stun: 0,
                            },
                        },
                        ref: 'dee6efca-71ef-438c-b762-624f9ce649f3',
                        distortion: {
                            decayDelay: 1.5,
                            decayRate: 40,
                            maximum: 1000,
                            warningRatio: 0.75,
                            recoveryRatio: 0.7,
                            powerRatioAtMaxDistortion: false,
                            powerChangeOnlyAtMaxDistortion: true,
                        },
                        missile: {
                            explosionSafetyDistance: 5,
                            projectileProximity: 1,
                            armTime: 1.5,
                            igniteTime: 0.3,
                            collisionDelayTime: 0.5,
                            irSignalMinValue: 0,
                            irSignalMaxValue: 0,
                            irSignalRiseRate: 0,
                            irSignalDecayRate: 0,
                            trackingSignalType: 'CrossSection',
                            lockSignalAmplifier: 2.5,
                            lockTime: 1,
                            lockingAngle: 60,
                            minRatioForLock: 1,
                            lockIncreaseRate: 1.3,
                            lockDecreaseRate: 9999,
                            lockRangeMin: 1900,
                            lockRangeMax: 25000,
                            lockResolutionRadius: 700,
                            signalResilienceMin: 1,
                            signalResilienceMax: 1.7,
                            linearSpeed: 857.5,
                            fuelTankSize: 50,
                            maxLifetime: 0,
                            minRadius: 0.25,
                            maxRadius: 3,
                            minPhysRadius: 20,
                            maxPhysRadius: 25,
                            hitType: 'explosion',
                            damage: {
                                damagePhysical: 2526.42,
                                damageEnergy: 0,
                                damageDistortion: 0,
                                damageThermal: 0,
                                damageBiochemical: 0,
                                damageStun: 0,
                            },
                        },
                        manufacturerData: {
                            calculatorType: 'manufacturer',
                            data: {
                                nameSmall: 'FSKI',
                                ref: '5f81335d-44e6-4104-841e-c5af9df06829',
                                name: 'FireStorm Kinetics',
                                calculatorName: 'FSKI',
                            },
                        },
                    },
                },
                {
                    id: 2,
                    name: 'Missile Turret',
                    selectedMissile: {
                        type: 'Missile',
                        subType: 'Missile',
                        size: 3,
                        grade: 'A',
                        name: 'Arrester III',
                        shortName: 'Arrstr III',
                        description:
                            'Using cross section targeting to hunt for its prey, the Firestorm Arrester proximity missile makes quick work of enemies caught in the crosshairs.',
                        physics: {
                            mass: 119,
                            temperature: {
                                enable: false,
                                initialTemperature: -1,
                                coolingEqualizationMultiplier: true,
                                internalTemperatureGeneration: false,
                                signatureParams: {
                                    enable: false,
                                    minimumTemperatureForIR: 250,
                                    temperatureToIR: 6,
                                },
                                itemResourceParams: {
                                    minOperatingTemperature: 0,
                                    minCoolingTemperature: 300,
                                    enableOverheat: false,
                                    overheatTemperature: 450,
                                    overheatWarningTemperature: 370,
                                    overheatRecoveryTemperature: 350,
                                },
                            },
                        },
                        health: {
                            hp: 50,
                            damageResistanceMultiplier: {
                                physical: 1,
                                energy: 1,
                                distortion: 1,
                                thermal: 1,
                                biochemical: 0,
                                stun: 0,
                            },
                        },
                        ref: 'dee6efca-71ef-438c-b762-624f9ce649f3',
                        distortion: {
                            decayDelay: 1.5,
                            decayRate: 40,
                            maximum: 1000,
                            warningRatio: 0.75,
                            recoveryRatio: 0.7,
                            powerRatioAtMaxDistortion: false,
                            powerChangeOnlyAtMaxDistortion: true,
                        },
                        missile: {
                            explosionSafetyDistance: 5,
                            projectileProximity: 1,
                            armTime: 1.5,
                            igniteTime: 0.3,
                            collisionDelayTime: 0.5,
                            irSignalMinValue: 0,
                            irSignalMaxValue: 0,
                            irSignalRiseRate: 0,
                            irSignalDecayRate: 0,
                            trackingSignalType: 'CrossSection',
                            lockSignalAmplifier: 2.5,
                            lockTime: 1,
                            lockingAngle: 60,
                            minRatioForLock: 1,
                            lockIncreaseRate: 1.3,
                            lockDecreaseRate: 9999,
                            lockRangeMin: 1900,
                            lockRangeMax: 25000,
                            lockResolutionRadius: 700,
                            signalResilienceMin: 1,
                            signalResilienceMax: 1.7,
                            linearSpeed: 857.5,
                            fuelTankSize: 50,
                            maxLifetime: 0,
                            minRadius: 0.25,
                            maxRadius: 3,
                            minPhysRadius: 20,
                            maxPhysRadius: 25,
                            hitType: 'explosion',
                            damage: {
                                damagePhysical: 2526.42,
                                damageEnergy: 0,
                                damageDistortion: 0,
                                damageThermal: 0,
                                damageBiochemical: 0,
                                damageStun: 0,
                            },
                        },
                        manufacturerData: {
                            calculatorType: 'manufacturer',
                            data: {
                                nameSmall: 'FSKI',
                                ref: '5f81335d-44e6-4104-841e-c5af9df06829',
                                name: 'FireStorm Kinetics',
                                calculatorName: 'FSKI',
                            },
                        },
                    },
                },
            ],
        }),
    },
    leadShip: {
        type: Boolean,
        default: true,
    },
})
// const emit = defineEmits()
// State management
const ship = ref(props.ship)
const shipName = computed(() => {
    return `${ship.value.manufacturer} ${ship.value.model}`
})
const selectedTorpedo = ref({
    type: 'Missile',
    subType: 'Torpedo',
    size: 10,
    grade: 'A',
    name: 'VT-T10 "Veritas"',
    shortName: 'VT-T10 Torpedo',
    description:
        'Bring Behring\'s expert engineering to bear with the VT-T10 "Veritas" Torpedo. Originally designed for the Polaris, this size 10 torpedo has earned a reputation as a dependable and incredibly powerful ordnance.',
    physics: {
        mass: 449,
        temperature: {
            enable: false,
            initialTemperature: -1,
            coolingEqualizationMultiplier: true,
            internalTemperatureGeneration: false,
            signatureParams: {
                enable: false,
                minimumTemperatureForIR: 250,
                temperatureToIR: 6,
            },
            itemResourceParams: {
                minOperatingTemperature: 0,
                minCoolingTemperature: 300,
                enableOverheat: false,
                overheatTemperature: 450,
                overheatWarningTemperature: 370,
                overheatRecoveryTemperature: 350,
            },
        },
    },
    health: {
        hp: 1000,
        damageResistanceMultiplier: {
            physical: 1,
            energy: 1,
            distortion: 1,
            thermal: 1,
            biochemical: 0,
            stun: 0,
        },
    },
    ref: 'bcdd8022-c2f4-49d0-8528-e4a3a7a01a03',
    distortion: {
        decayDelay: 1.5,
        decayRate: 40,
        maximum: 1000,
        warningRatio: 0.75,
        recoveryRatio: 0.7,
        powerRatioAtMaxDistortion: false,
        powerChangeOnlyAtMaxDistortion: true,
    },
    missile: {
        explosionSafetyDistance: 1500,
        projectileProximity: 10,
        armTime: 1,
        igniteTime: 0.8,
        collisionDelayTime: 0.5,
        irSignalMinValue: 0,
        irSignalMaxValue: 0,
        irSignalRiseRate: 0,
        irSignalDecayRate: 0,
        trackingSignalType: 'Infrared',
        lockSignalAmplifier: 5,
        lockTime: 7,
        lockingAngle: 20,
        minRatioForLock: 1,
        lockIncreaseRate: 0.6,
        lockDecreaseRate: 9999,
        lockRangeMin: 2500,
        lockRangeMax: 30000,
        lockResolutionRadius: 700,
        signalResilienceMin: 1,
        signalResilienceMax: 1.7,
        linearSpeed: 270,
        fuelTankSize: 64,
        maxLifetime: 0,
        minRadius: 10,
        maxRadius: 25,
        minPhysRadius: 30,
        maxPhysRadius: 60,
        hitType: 'explosion',
        damage: {
            damagePhysical: 750000,
            damageEnergy: 0,
            damageDistortion: 0,
            damageThermal: 0,
            damageBiochemical: 0,
            damageStun: 0,
        },
    },
    manufacturerData: {
        calculatorType: 'manufacturer',
        data: {
            nameSmall: 'BEHR',
            name: 'Behring',
            description:
                'The Behring Research Consortium was founded in 2554 on Terra as the end result of several years of buyouts and consolidation of dozens of small research and development firms by Behring Equity Investments. By having so many different research units focusing on a wide variety of developments, the Behring group hoped to increase the likelihood of expensive research resulting in a marketable product. Their history speaks for itself as the famed laboratory is accredited for the standardization of laser weaponry and dozens of other innovations. Today, Behring is still going strong with their technological forward products featuring straight forward and simple designs, making everything from guns, missiles, sentry drones, to shields and armor.',
            ref: '65a5d887-3b21-4046-a718-6912c0c7c3be',
            calculatorName: 'BEHR',
        },
    },
    timeToTarget: '37.04',
})
const distanceToTarget = ref(10000)
const distanceToTargetOptions = distanceOptions
const timeToTarget = (missile, distance) => {
    if (distance === 0) return 'N/A'
    return (distance / missile.linearSpeed).toFixed(2)
}

// Watchers
watch(
    [() => ship.value.missileLaunchers, selectedTorpedo, distanceToTarget],
    ([launchers, torpedo, distance]) => {
        // Handle multiple missile launchers
        if (launchers) {
            launchers.forEach((launcher) => {
                if (launcher.selectedMissile) {
                    launcher.selectedMissile.timeToTarget = timeToTarget(
                        launcher.selectedMissile.missile,
                        distance
                    )
                    console.log(
                        `${launcher.name} - Missile: ${launcher.selectedMissile.name}, Time to Target: ${launcher.selectedMissile.timeToTarget} seconds`
                    )
                }
            })
        }

        // Handle torpedo
        if (torpedo) {
            selectedTorpedo.value.timeToTarget = timeToTarget(
                torpedo.missile,
                distance
            )
            console.log(
                `Torpedo: ${selectedTorpedo.value.name}, Time to Target: ${selectedTorpedo.value.timeToTarget} seconds`
            )
        }
    },
    { deep: true, immediate: true }
)
</script>

<template>
    <main>
        <section id="ship-info" class="w-full h-max">
            <h2 class="text-xl font-bold">{{ shipName }}</h2>
        </section>
        <div class="w-full gap-3 flex-is-jc">
            <SearchSelect
                v-model.number="distanceToTarget"
                label="Distance to Target"
                :options="distanceToTargetOptions"
                inputType="number"
                placeholder="Select Distance"
                label-class="text-white"
            />
            <MissileSelect
                v-for="launcher in ship.missileLaunchers"
                :key="launcher.id"
                v-model="launcher.selectedMissile"
                :label="launcher.name"
                :options="missiles"
            />
            <MissileSelect
                v-model="selectedTorpedo"
                label="Select a Torpedo"
                :options="torpedoes"
            />
        </div>
        <MissileSimulation
            :ship="ship"
            :selected-torpedo="selectedTorpedo"
            :distance="distanceToTarget"
        />
    </main>
</template>
