<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    page: { type: Number, required: true },
    pageCount: { type: Number, required: true }
})

const emit = defineEmits<{
    (e: 'update:page', value: number): void
}>()

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

function goTo(targetPage: number) {
    const max = Math.max(1, props.pageCount || 1)
    const next = clamp(targetPage, 1, max)
    if (next !== props.page) emit('update:page', next)
}

const canPrev = computed(() => props.page > 1)
const canNext = computed(() => props.page < props.pageCount)
</script>

<template>
    <div class="flex items-center gap-2">
        <button
            class="h-9 w-9 rounded-md border border-(--ui-border) text-sm disabled:opacity-50 cursor-pointerdisabled:cursor-not-allowed"
            :disabled="!canPrev" @click="goTo(1)" aria-label="first page">
            <UIcon name="i-lucide:chevron-first" />
        </button>
        <button
            class="h-9 w-9 rounded-md border border-(--ui-border) text-sm disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed disabled:animate-none animate-pulse"
            :disabled="!canPrev" @click="goTo(page - 1)" aria-label="previous page">
            <UIcon name="i-lucide-chevron-left" />
        </button>
        <span class="px-4 py-2 rounded-md bg-primary text-primary-inverted text-sm min-w-9 text-center font-bold">
            {{ page }}
        </span>
        <button
            class="h-9 w-9 rounded-md border border-(--ui-border) text-sm disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed disabled:animate-none animate-pulse"
            :disabled="!canNext" @click="goTo(page + 1)" aria-label="next page">
            <UIcon name="i-lucide-chevron-right" />
        </button>
        <button
            class="h-9 w-9 rounded-md border border-(--ui-border) text-sm disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed"
            :disabled="!canNext" @click="goTo(pageCount)" aria-label="last page">
            <UIcon name="i-lucide:chevron-last" />
        </button>
        <span class="text-xs text-muted">de {{ pageCount }}</span>
    </div>
</template>
