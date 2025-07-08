<script setup>
import { ref, watch, computed, watchEffect } from 'vue'
import { OnClickOutside } from '@vueuse/components'
// Components
import SvgComponent from '@/components/UI/SvgComponent.vue'
import { getStyles } from '@/composables/getStyles'

import selectCaret from '@/assets/SelectCaret.vue'

const props = defineProps({
    modelValue: [String, Object, Boolean, Number],
    options: {
        type: Array,
        required: true,
    },
    cleared: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Boolean,
    },
    errorMessages: {
        type: Array,
        default: () => [],
    },
    placeholder: String,
    containerClass: String,
    inputClass: String,
    labelClass: String,
    optionsClass: String,
    optionClass: String,
    targetAttr: {
        type: String,
        default: 'value',
    },
})

const emit = defineEmits(['update:modelValue', 'value', 'resetCleared'])

const selectedValue = ref(props.modelValue)
const showOptions = ref(false)

watch(
    () => props.cleared,
    (newVal) => {
        if (newVal === true) {
            selectedValue.value = null
        }
    }
)

const toggleOptions = () => {
    showOptions.value = !showOptions.value
}

const setSelected = (value) => {
    selectedValue.value = value.label

    emit('update:modelValue', value[props.targetAttr])
    showOptions.value = false
}

const handleInput = (event) => {
    const inputValue = event.target.value
    selectedValue.value = inputValue

    // Show options when user starts typing
    if (!showOptions.value && inputValue.length > 0) {
        showOptions.value = true
    }

    // Emit the raw input value when user types manually
    emit('update:modelValue', inputValue)
}

const messages = computed(() => {
    if (props.errorMessages) {
        return props.errorMessages
    }
    return []
})

const filteredOptions = computed(() => {
    if (!selectedValue.value) {
        return props.options
    }

    return props.options.filter((option) =>
        option.label.toLowerCase().includes(selectedValue.value.toLowerCase())
    )
})
watchEffect(() => {
    let found = props.options.find((state) => state.value === props.modelValue)
    if (found) {
        selectedValue.value = found.label
    }
})

const classes = ref(getStyles(props, 'textInput'))
</script>

<template>
    <section :class="classes.containerClass">
        <label
            ref="select-label"
            data-test="select-label"
            :class="classes.labelClass"
            >{{ label }}</label
        >
        <OnClickOutside
            class="relative w-full mt-1"
            @trigger="showOptions = false"
        >
            <input
                ref="select-input"
                v-bind="$attrs"
                v-model="selectedValue"
                :class="classes.inputClass"
                :placeholder="props.placeholder"
                type="text"
                data-test="select-input"
                tabindex="0"
                @input="handleInput"
                @focus="showOptions = true"
                @keydown.enter.prevent="toggleOptions"
                @keydown.down.prevent="showOptions = true"
                @keydown.up.prevent="showOptions = true"
            />

            <SvgComponent
                :svg="selectCaret"
                class="absolute mt-2 cursor-pointer right-2 top-1 dark:text-white"
                size="14"
                @click="toggleOptions"
            />

            <div v-show="`${error ? 'inline-flex' : 'invisible'}`" class="mt-1">
                <div
                    v-for="({ $message }, i) in messages"
                    :key="i"
                    class="text-xs text-red-700 dark:text-red-400"
                >
                    {{ $message }}
                </div>
            </div>

            <div
                v-if="showOptions"
                data-test="select-options"
                :class="classes.optionsClass"
            >
                <div
                    v-for="(option, i) in filteredOptions"
                    :key="option.value"
                    tabindex="0"
                    :data-test="`select-option-${i}`"
                    :class="classes.optionClass"
                    :value="option.value"
                    @click="setSelected(option)"
                    @keydown.enter.prevent="setSelected(option)"
                >
                    {{ option.label }}
                </div>
                <div
                    v-if="filteredOptions.length === 0"
                    class="px-3 py-2 text-gray-500 dark:text-gray-400"
                >
                    No options found
                </div>
            </div>
        </OnClickOutside>
    </section>
</template>
