<template>

    <div class="flex flex-col gap-4 mt-8 h-28">

        <h2 class="text-sm text-center bold">
            Pesquise pelo código <strong>NCM</strong> ou <strong> descrição </strong> do produto
        </h2>
        <div class="flex flex-row gap-2 w-full">
            <UButton icon="i-lucide-search" color="neutral" variant="ghost" />
            <UButton v-if="(search || '').length" icon="i-lucide-x" size="xs" variant="ghost" color="secondary"
                @click="() => { search = ''; emit('update:query', '') }" aria-label="Limpar pesquisa" />
            <UInput v-model="search" placeholder="Pesquisar" class="w-full" />
        </div>
        <div class="flex flex-row gap-2 w-full justify-center items-center mb-4 text-emerald-500 animate-bounce">
            <UIcon name="i-material-symbols:arrow-cool-down-rounded" class="size-4" />
            <p class="text-sm text-center font-bold m-4">Resultado</p>
            <UIcon name="i-material-symbols:arrow-cool-down-rounded" class="size-4" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatNCMCodeByPattern } from '../utils/format'

const props = defineProps<{
    query?: string
}>()

const search = ref(props.query || '')

const emit = defineEmits<{
    (e: 'update:query', value: string): void
}>()

watch(() => props.query, (val) => {
    if (val !== undefined && val !== search.value) {
        search.value = val || ''
    }
})

watch(search, (val) => {
    const raw = (val || '').toString()
    const onlyDigits = /^\d+$/.test(raw)
    const hasDot = /\./.test(raw)

    if (onlyDigits && !hasDot) {
        const formatted = formatNCMCodeByPattern(raw, '4-2-2')
        if (formatted && formatted !== raw) {
            search.value = formatted
            emit('update:query', formatted)
            return
        }
    }

    emit('update:query', val)
})

</script>