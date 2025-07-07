<script setup>
import { ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
// Components
import Button from '@/components/UI/Button.vue'
import ProgressBar from '@/components/UI/loading/ProgressBar.vue'

// const props = defineProps({})
// const emit = defineEmits()
class Queue {
    constructor() {
        this.items = []
    }
    enqueue(element) {
        this.items.push(element)
    }
    dequeue() {
        if (this.isEmpty()) return 'Underflow'
        return this.items.shift()
    }
    removeItem(id) {
        let index = this.items.findIndex((item) => item.id === id)
        if (index === -1) return
        this.items.splice(index, 1)
    }
    front() {
        if (this.isEmpty()) return 'No elements in Queue'
        return this.items[0]
    }
    isEmpty() {
        return this.items.length == 0
    }
    size() {
        return this.items.length
    }
    printQueue() {
        let str = ''
        for (let i = 0; i < this.items.length; i++) str += this.items[i] + ' '
        return str
    }
}

const q = ref(new Queue())
const size = ref(q.value.size())
const errors = ref(0)
const activeProgressBars = ref([])
const errorQueue = ref(new Queue())
const addItem = () => {
    if (activeProgressBars.value.length < 5) {
        activeProgressBars.value.push({
            id: uuidv4(),
            progress: 0,
            status: 'New Item',
            error: false,
        })
    } else {
        q.value.enqueue({
            id: uuidv4(),
            progress: 0,
            status: 'Queue Item',
            error: false,
        })

        size.value = q.value.size()
    }
}

const removeItem = (id) => {
    let index = activeProgressBars.value.findIndex((item) => item.id === id)
    if (index === -1) return
    activeProgressBars.value.splice(index, 1)
}

const handleError = (id) => {
    let index = activeProgressBars.value.findIndex((item) => item.id === id)
    if (index === -1) return
    activeProgressBars.value[index].error = true
    activeProgressBars.value[index].timeout = 1000
    activeProgressBars.value[index].status = 'Error'
    errorQueue.value.enqueue(activeProgressBars.value[index])
    activeProgressBars.value.splice(index, 1)
    errors.value = errorQueue.value.size()
}

watch(activeProgressBars.value, (newVal) => {
    if (q.value.size() > 0 && activeProgressBars.value.length < 5) {
        let item = q.value.dequeue()
        activeProgressBars.value.push(item)
        size.value = q.value.size()
    }
    if (
        q.value.size() === 0 &&
        activeProgressBars.value.length < 5 &&
        errorQueue.value.size() > 0
    ) {
        let item = errorQueue.value.dequeue()
        activeProgressBars.value.push(item)
        errors.value = errorQueue.value.size()
    }
})
</script>

<template>
    <div class="w-full h-full">
        <h1>Queue Size: {{ size }}</h1>
        <h1>Error queue: {{ errors }}</h1>
        <Button text="Add New" @click="addItem" />
        <ProgressBar
            v-for="item in activeProgressBars"
            :key="item.id"
            :text="item.status"
            :timeout="item.timeout"
            :error="item.error"
            @remove-item="removeItem(item.id)"
            @handle-error="handleError(item.id)"
        />
    </div>
</template>
