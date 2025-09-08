<template>

    <div class="flex flex-col gap-4  h-28 mt-30">
        <p class="text-sm text-center bold">
            Pesquise pelo código <strong>NCM</strong> ou <strong> descrição </strong> do produto
        </p>
        <div class="flex flex-row gap-2 w-full">
            <UButton icon="i-lucide-search" color="neutral" variant="ghost" />
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

const search = ref('')

const emit = defineEmits<{
    (e: 'update:query', value: string): void
}>()

watch(search, (val) => emit('update:query', val))

</script>