interface NCMItem {
  id?: number;
  codigo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo_ato_inicio: string;
  numero_ato_inicio: string;
  ano_ato_inicio: string;
  [key: string]: any;
}

interface NCMContext {
  chapters: Map<string, string>;
  positions: Map<string, string>;
}

const context = ref<NCMContext>({
  chapters: new Map(),
  positions: new Map(),
});

const isContextInitialized = ref(false);

const { saveContext, loadContext, clearStoredContext } = useNCMStorage();

export function useNCMContext() {
  function getDigitsOnly(code: string): string {
    return (code || '').toString().replace(/\D/g, '');
  }

  function getChapterKey(code: string): string {
    const digits = getDigitsOnly(code);
    return digits.substring(0, 2).padStart(2, '0');
  }

  function getPositionKey(code: string): string {
    const digits = getDigitsOnly(code);
    return digits.substring(0, 4).padEnd(4, '0');
  }

  function isChapter(code: string): boolean {
    return getDigitsOnly(code).length === 2;
  }

  function isPosition(code: string): boolean {
    return getDigitsOnly(code).length === 4;
  }

  function buildContextFromData(data: NCMItem[], forceRebuild = false) {
    if (!data || !Array.isArray(data)) return;

    if (isContextInitialized.value && !forceRebuild) return;

    data.forEach((item) => {
      const digits = getDigitsOnly(item.codigo);

      if (digits.length === 2) {
        const chapterKey = getChapterKey(item.codigo);
        context.value.chapters.set(chapterKey, item.descricao);
      }

      if (digits.length === 4) {
        const positionKey = getPositionKey(item.codigo);
        context.value.positions.set(positionKey, item.descricao);
      }
    });

    isContextInitialized.value = true;
  }

  function addToContext(data: NCMItem[]) {
    if (!data || !Array.isArray(data)) return;

    let hasChanges = false;

    data.forEach((item) => {
      const digits = getDigitsOnly(item.codigo);

      if (digits.length === 2) {
        const chapterKey = getChapterKey(item.codigo);
        if (!context.value.chapters.has(chapterKey)) {
          context.value.chapters.set(chapterKey, item.descricao);
          hasChanges = true;
        }
      }

      if (digits.length === 4) {
        const positionKey = getPositionKey(item.codigo);
        if (!context.value.positions.has(positionKey)) {
          context.value.positions.set(positionKey, item.descricao);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      saveContext(context.value);
    }
  }

  async function initializeContextWithFullData(fullData: NCMItem[]) {
    const storedContext = await loadContext();
    if (storedContext) {
      context.value = storedContext;
      isContextInitialized.value = true;
    } else {
      clearContext();
      buildContextFromData(fullData, true);
      saveContext(context.value);
    }
  }

  async function loadStoredContext(): Promise<boolean> {
    const storedContext = await loadContext();
    if (storedContext) {
      context.value = storedContext;
      isContextInitialized.value = true;
      return true;
    }
    return false;
  }

  function getChapterDescription(code: string): string {
    const chapterKey = getChapterKey(code);
    return context.value.chapters.get(chapterKey) || `Grupo ${chapterKey}`;
  }

  function getPositionDescription(code: string): string {
    const positionKey = getPositionKey(code);
    return (
      context.value.positions.get(positionKey) ||
      `Posição ${positionKey.substring(0, 2)}.${positionKey.substring(2, 4)}`
    );
  }

  function getContextualDescription(code: string): string {
    const digits = getDigitsOnly(code);

    if (digits.length === 2) {
      return getChapterDescription(code);
    }

    if (digits.length === 4) {
      return getPositionDescription(code);
    }

    return getPositionDescription(code);
  }

  function clearContext() {
    context.value.chapters.clear();
    context.value.positions.clear();
    isContextInitialized.value = false;
  }

  async function clearStoredContext() {
    await clearStoredContext();
    clearContext();
  }

  return {
    context: readonly(context),
    isContextInitialized: readonly(isContextInitialized),
    buildContextFromData,
    addToContext,
    initializeContextWithFullData,
    loadStoredContext,
    getChapterDescription,
    getPositionDescription,
    getContextualDescription,
    clearContext,
    clearStoredContext,
    getChapterKey,
    getPositionKey,
    isChapter,
    isPosition,
  };
}
