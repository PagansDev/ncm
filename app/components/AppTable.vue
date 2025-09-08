<script setup lang="ts">
import { formatDateBR, decodeHtmlEntities } from '../utils/format'

interface NCMItem {
    id?: number
    codigo: string
    descricao: string
    data_inicio: string
    data_fim: string
    tipo_ato_inicio: string
    numero_ato_inicio: string
    ano_ato_inicio: string
    [key: string]: any
}

interface NCMGroup {
    grupo: string
    items: NCMItem[]
    expanded: boolean
    description: string
}

interface NCMPositionGroup {
    posicao: string
    description: string
    items: NCMItem[]
    parentDescription?: string
}

const props = defineProps<{
    data: NCMItem[]
    loading?: boolean
}>()

const rowsPerPage = 100
const currentPage = ref(1)
const expandedGroups = ref<Set<string>>(new Set())
const copiedCode = ref<string | null>(null)


function getGroupKey(codigo: string): string {
    if (!codigo) return 'Outros'
    // Extrai apenas dígitos e usa somente os dois primeiros para formar o grupo
    const numeric = codigo.toString().replace(/\D/g, '')
    const firstTwo = numeric.substring(0, 2)
    return firstTwo.padStart(2, '0')
}

function getGroupDescription(codigo: string, items: NCMItem[]): string {
    // Tenta encontrar um item cujo código tenha exatamente 2 dígitos que correspondem ao grupo
    const twoDigitItem = items.find(item => {
        const onlyDigits = (item.codigo || '').toString().replace(/\D/g, '')
        return onlyDigits.length === 2 && onlyDigits.padStart(2, '0') === codigo
    })
    if (twoDigitItem) {
        return twoDigitItem.descricao
    }

    // Fallback específico: prioriza 4 dígitos com descrição significativa (não "Outros" e não começando com '-')
    const digitsLength = (code: string) => (code || '').toString().replace(/\D/g, '').length
    const isMeaningful = (desc: string) => {
        const d = (desc || '').trim()
        return d.length > 0 && !/^\-/.test(d) && !/^outros\b/i.test(d) && !/^\-\-\s*outros/i.test(d)
    }

    const pickByLen = (len: number): NCMItem | undefined => {
        const candidates = items.filter(i => digitsLength(i.codigo) === len)
        if (candidates.length === 0) return undefined
        const meaningful = candidates.find(c => isMeaningful(c.descricao))
        return meaningful || candidates[0]
    }

    const pos = pickByLen(4)
    if (pos) return pos.descricao
    const subpos = pickByLen(6)
    if (subpos) return subpos.descricao
    const ncm = pickByLen(8)
    if (ncm) return ncm.descricao

    return `Grupo ${codigo}`
}

function getDigitsOnly(code: string): string {
    return (code || '').toString().replace(/\D/g, '')
}

function getPositionKey(code: string): string {
    const digits = getDigitsOnly(code)
    return digits.substring(0, 4).padEnd(4, '0')
}

function getDigitsLength(code: string): number {
    return getDigitsOnly(code).length
}

const groupedData = computed<NCMGroup[]>(() => {
    const groups: { [key: string]: NCMItem[] } = {}
    const twoDigitGroupItem: Map<string, NCMItem> = new Map()

    if (!props.data || !Array.isArray(props.data)) {
        return []
    }

    props.data.forEach((item: NCMItem) => {
        const onlyDigits = (item.codigo || '').toString().replace(/\D/g, '')
        if (onlyDigits.length === 2) {
            const key = onlyDigits.padStart(2, '0')
            twoDigitGroupItem.set(key, item)
        }
    })

    props.data.forEach((item: NCMItem) => {
        const groupKey = getGroupKey(item.codigo)
        if (!groups[groupKey]) {
            groups[groupKey] = []
        }
        groups[groupKey].push(item)
    })

    return Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([grupo, items]) => {
            const isExpanded = !expandedGroups.value.has(`collapsed_${grupo}`)
            const headerItem = twoDigitGroupItem.get(grupo)
            return {
                grupo,
                items: items.sort((a, b) => a.codigo.localeCompare(b.codigo)),
                expanded: isExpanded,
                description: headerItem ? headerItem.descricao : `Grupo ${grupo}`
            }
        })
})


const paginatedGroups = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage
    const end = start + rowsPerPage
    return groupedData.value.slice(start, end)
})

function buildPositionGroups(items: NCMItem[], parentDescription?: string): NCMPositionGroup[] {
    const byPosition: { [key: string]: NCMItem[] } = {}
    const positionHeader: Map<string, NCMItem | undefined> = new Map()

    items.forEach(item => {
        const digits = getDigitsOnly(item.codigo)
        const posKey = getPositionKey(item.codigo)
        if (!byPosition[posKey]) byPosition[posKey] = []
        byPosition[posKey].push(item)
        if (digits.length === 4) positionHeader.set(posKey, item)
        if (!positionHeader.has(posKey)) positionHeader.set(posKey, undefined)
    })

    return Object.entries(byPosition)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([posicao, itemsForPos]) => {
            const header = positionHeader.get(posicao)
            return {
                posicao,
                description: header ? header.descricao : `Posição ${posicao.substring(0, 2)}.${posicao.substring(2, 4)}`,
                parentDescription,
                items: itemsForPos.sort((a, b) => a.codigo.localeCompare(b.codigo))
            }
        })
}

function filterPositionItems(items: NCMItem[]): NCMItem[] {
    const hasHeader = items.some(i => getDigitsLength(i.codigo) === 4)
    if (!hasHeader) return items
    return items.filter(i => getDigitsLength(i.codigo) !== 4)
}


const totalPages = computed(() => {
    return Math.max(1, Math.ceil(groupedData.value.length / rowsPerPage))
})


watchEffect(() => {
    const maxPage = totalPages.value
    if (currentPage.value > maxPage) {
        currentPage.value = maxPage
    }
    if (currentPage.value < 1) {
        currentPage.value = 1
    }
})

function toggleGroup(grupo: string) {
    const collapsedKey = `collapsed_${grupo}`
    if (expandedGroups.value.has(collapsedKey)) {
        expandedGroups.value.delete(collapsedKey)
    } else {
        expandedGroups.value.add(collapsedKey)
    }
}


function goToPage(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

async function copyToClipboard(codigo: string) {
    try {
        await navigator.clipboard.writeText(codigo)
        showCopyFeedback(codigo)
    } catch (err) {
        const textArea = document.createElement('textarea')
        textArea.value = codigo
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
            document.execCommand('copy')
            showCopyFeedback(codigo)
        } catch (fallbackErr) {
            console.error('Erro ao copiar:', fallbackErr)
        }
        document.body.removeChild(textArea)
    }
}

function showCopyFeedback(codigo: string) {
    copiedCode.value = codigo
    setTimeout(() => {
        copiedCode.value = null
    }, 2000) 
}

</script>

<template>
    <div class="w-full">
        <!-- Skeleton loading -->
        <div v-if="loading" class="p-0">
            <USkeleton class="h-[60vh] w-full" :ui="{ rounded: 'rounded-md' }" />
        </div>

        <!-- Tabela -->
        <div v-else class="w-full max-h-[60vh] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Cabeçalho -->
                <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                    <tr>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Código</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Descrição</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Data Início</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Data Fim</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tipo Ato</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Número Ato</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Ano Ato</th>
                    </tr>
                </thead>

                <!-- Corpo da tabela -->
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <template v-for="group in paginatedGroups" :key="group.grupo">
                        <!-- Linha do grupo -->
                        <tr class="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer"
                            @click="toggleGroup(group.grupo)">
                            <td colspan="7" class="px-4 py-3 text-sm font-medium text-blue-900 dark:text-blue-100">
                                <div class="flex items-center">
                                    <UIcon :name="group.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                                        class="w-4 h-4 mr-2" />
                                    <div class="flex-1">
                                        <div class="font-semibold" v-html="decodeHtmlEntities(group.description)"></div>
                                        <div class="text-xs text-blue-700 dark:text-blue-300 mt-1">{{ group.items.length
                                            }} itens</div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Itens do grupo (quando expandido) -->
                        <template v-if="group.expanded">
                            <template v-for="posGroup in buildPositionGroups(group.items, group.description)"
                                :key="posGroup.posicao">
                                <!-- Cabeçalho da posição -->
                                <tr class="bg-gray-50 dark:bg-gray-800">
                                    <td colspan="7"
                                        class="px-6 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        <span class="opacity-70">{{ group.grupo }} — <span
                                                v-html="decodeHtmlEntities(posGroup.parentDescription || group.description)"></span></span>
                                        <span class="mx-2">/</span>
                                        {{ posGroup.posicao.substring(0, 2) }}.{{ posGroup.posicao.substring(2, 4) }} —
                                        <span v-html="decodeHtmlEntities(posGroup.description)"></span>
                                    </td>
                                </tr>

                                <!-- Itens da posição (exclui o cabeçalho de 4 dígitos quando presente) -->
                                <tr v-for="item in filterPositionItems(posGroup.items)" :key="item.id || item.codigo"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                        <div class="flex items-center gap-2">
                                            <span>{{ item.codigo }}</span>
                                            <button @click.stop="copyToClipboard(item.codigo)"
                                                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all opacity-70 hover:opacity-100"
                                                :class="{ 'bg-green-100 dark:bg-green-900/30': copiedCode === item.codigo }"
                                                :title="copiedCode === item.codigo ? 'Copiado!' : `Copiar código ${item.codigo}`">
                                                <UIcon
                                                    :name="copiedCode === item.codigo ? 'i-lucide-check' : 'i-lucide-copy'"
                                                    class="w-3 h-3 transition-all"
                                                    :class="{ 'text-green-600 dark:text-green-400': copiedCode === item.codigo }" />
                                            </button>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                        <div class="whitespace-normal break-words"
                                            v-html="decodeHtmlEntities(item.descricao)"></div>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{
                                        formatDateBR(item.data_inicio) }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{
                                        formatDateBR(item.data_fim) }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{
                                        item.tipo_ato_inicio }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{
                                        item.numero_ato_inicio }}</td>
                                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{
                                        item.ano_ato_inicio }}</td>
                                </tr>
                            </template>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Paginação -->
        <div v-if="!loading && totalPages > 1"
            class="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Próximo
                </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Mostrando grupos
                        <span class="font-medium">{{ (currentPage - 1) * rowsPerPage + 1 }}</span>
                        a
                        <span class="font-medium">{{ Math.min(currentPage * rowsPerPage, groupedData.length) }}</span>
                        de
                        <span class="font-medium">{{ groupedData.length }}</span>
                        grupos
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <UIcon name="i-lucide-chevron-left" class="h-5 w-5" />
                        </button>

                        <template v-for="page in Math.min(5, totalPages)" :key="page">
                            <button @click="goToPage(page)" :class="[
                                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                currentPage === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            ]">
                                {{ page }}
                            </button>
                        </template>

                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <UIcon name="i-lucide-chevron-right" class="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
