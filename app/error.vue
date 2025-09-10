<script setup lang="ts">

definePageMeta({
    layout: false
})

const props = defineProps<{
    error: {
        statusCode: number
        statusMessage: string
        message?: string
    }
}>()

const errorTitle = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return 'Página não encontrada'
        case 500:
            return 'Erro interno do servidor'
        default:
            return 'Algo deu errado'
    }
})

const errorDescription = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return 'A página que você está procurando não existe ou foi movida.'
        case 500:
            return 'Ocorreu um erro interno. Nossa equipe foi notificada.'
        default:
            return 'Algo inesperado aconteceu. Tente novamente mais tarde.'
    }
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppHeader />

        <div class="container mx-auto px-4 py-16">
            <div class="max-w-2xl mx-auto text-center">
                <!-- Ícone de erro -->
                <div class="mb-8">
                    <div
                        class="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                        <UIcon :name="error.statusCode === 404 ? 'i-lucide-file-x' : 'i-lucide-alert-triangle'"
                            class="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <!-- Código de erro -->
                <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    {{ error.statusCode }}
                </h1>

                <!-- Título do erro -->
                <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    {{ errorTitle }}
                </h2>

                <!-- Descrição -->
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    {{ errorDescription }}
                </p>

                <!-- Mensagem técnica (se disponível) -->
                <div v-if="error.message" class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {{ error.message }}
                    </p>
                </div>

                <!-- Ações -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <UButton to="/" icon="i-lucide-home" size="lg" color="primary">
                        Voltar ao início
                    </UButton>

                    <UButton to="/ncm" icon="i-lucide-table" size="lg" variant="outline">
                        Ver tabela NCM
                    </UButton>
                </div>

                <!-- Link para reportar erro -->
                <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-500">
                        Se você acredita que isso é um erro,
                        <a href="https://www.linkedin.com/in/pagansdev/" target="_blank"
                            class="text-emerald-600 dark:text-emerald-400 hover:underline">
                            entre em contato
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
