<script setup lang="ts">
const route = useRoute()

const breadcrumbItems = computed(() => {
    const items = [
        { label: '', icon: 'i-lucide-house', to: '/' }
    ]

    if (route.name && route.name !== 'index' && typeof route.name === 'string') {
        items.push({
            label: route.name,
            icon: 'i-lucide-link',
            to: route.path
        })
    }

    return items
})

const dropdownItems = computed(() => {
    const items = [
        {
            label: 'Início',
            icon: 'i-lucide-home',
            to: '/',
            active: route.name === 'index'
        },
        {
            label: 'Tabela NCM',
            icon: 'i-lucide-table',
            to: '/ncm',
            active: route.name === 'ncm'
        },
        {
            label: 'CFOP',
            icon: 'i-lucide-file-text',
            disabled: true
        }
    ]

    return [items]
})
</script>

<template>
    <div class="
    flex
    justify-between
    items-center
    p-4
    border-b
    border-gray-200
    dark:border-gray-700
    w-[100dvw]
    h-26
    bg-emerald-500
    dark:bg-emerald-500
    z-99
    ">
        <img src="/TFlogo.png" alt="Tabela Fiscal Logo" class="h-20 w-auto rounded-2xl" />
        <div>


            <UBreadcrumb :items="breadcrumbItems" class="text-white dark:text-gray-200" :ui="{
                link: 'text-white/90 dark:text-gray-300 hover:text-white dark:hover:text-gray-100',
                separatorIcon: 'text-white'
            }" />
        </div>
        <div class="flex flex-row gap-2 items-center">
            <h1 class="text-2xl font-bold text-white dark:text-gray-100">Tabela Fiscal</h1>
            <a href="https://www.linkedin.com/in/pagansdev/" target="_blank">
                <p
                    class="text-sm text-white/80 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors">
                    By PagansDev</p>
            </a>
        </div>
        <div>
            <UDropdownMenu :items="dropdownItems" :ui="{
                content: 'w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                item: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                itemLeadingIcon: 'text-gray-500 dark:text-gray-400'
            }">
                <UButton icon="i-lucide-menu" label="Navegar" color="neutral" variant="outline"
                    class="border-white/30 hover:bg-white/10 text-white bg-transparent" />
            </UDropdownMenu>
        </div>

        <div class="flex items-center gap-3">
            <ColorModeButton />
        </div>

    </div>
</template>
