<script setup lang="ts">
const router = useRouter()
const showDevModal = ref(false)

function goToNCM() {
    router.push('/ncm')
}

function openDevModal() {
    showDevModal.value = true
}

useHead({
    title: 'Tabela Fiscal - Página Inicial',
    meta: [
        { name: 'description', content: 'Central de Tabelas Fiscais: NCM, CFOP e mais.' },
        { name: 'keywords', content: 'Tabela Fiscal, NCM, CFOP, Tabelas Fiscais' },
        { name: 'author', content: 'PagansDev' }
    ]
})

definePageMeta({
    name: 'Início'
})
</script>

<template>
    <div class="w-full max-w-6xl mx-auto px-4 py-10">
        <section class="text-center space-y-4 mb-10 flex flex-col items-center justify-center">
            <img src="/TFlogo.png" alt="Tabela Fiscal Logo"
                class="h-[20rem] w-auto rounded-2xl border-2 border-gray-200 dark:border-gray-800" />
            <p class="text-gray-600 dark:text-gray-400">
                Encontre rapidamente códigos e descrições das tabelas fiscais brasileiras.
            </p>
            <p class="text-gray-600 dark:text-gray-400">
                Objetivo: oferecer consulta rápida, confiável e gratuita às principais tabelas como NCM e CFOP.
            </p>
        </section>

        <section>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Card NCM -->
                <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow cursor-pointer"
                    @click="goToNCM">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold">NCM</h2>
                        <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Nomenclatura Comum do Mercosul. Consulte códigos, descrições e copie facilmente.
                    </p>
                    <UButton class="mt-4" color="primary">Abrir Tabela NCM</UButton>
                </div>

                <!-- Card CFOP (placeholder) -->
                <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow cursor-pointer"
                    @click="openDevModal">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold">CFOP</h2>
                        <UIcon name="i-lucide-wrench" class="h-5 w-5" />
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Códigos Fiscais de Operações e Prestações — em breve.
                    </p>
                    <UButton class="mt-4" color="secondary" variant="outline">Em desenvolvimento</UButton>
                </div>

                <!-- Outro placeholder -->
                <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow cursor-pointer"
                    @click="openDevModal">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold">Outras Tabelas</h2>
                        <UIcon name="i-lucide-wrench" class="h-5 w-5" />
                    </div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Mais tabelas fiscais úteis chegarão aqui.
                    </p>
                    <UButton class="mt-4" color="secondary" variant="outline">Em desenvolvimento</UButton>
                </div>
            </div>
        </section>

        <UModal v-model:open="showDevModal" title="Funcionalidade em desenvolvimento"
            description="Estamos trabalhando para trazer esta tabela em breve.">
            <template #body>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        Esta funcionalidade ainda está em desenvolvimento. Fique de olho nas próximas atualizações!
                    </p>
                    <div class="flex justify-end">
                        <UButton color="secondary" variant="ghost" class="cursor-pointer" @click="showDevModal = false">
                            Fechar</UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>