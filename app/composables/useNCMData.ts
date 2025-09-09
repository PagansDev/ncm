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

export function useNCMData() {
  const fullData = ref<NCMItem[]>([]);
  const filteredData = ref<NCMItem[]>([]);
  const loading = ref(false);
  const { initializeContextWithFullData } = useNCMContext();

  async function loadFullData() {
    if (fullData.value.length > 0) return fullData.value;

    loading.value = true;
    try {
      if (fullData.value.length > 0) {
        initializeContextWithFullData(fullData.value);
      }

      return fullData.value;
    } catch (error) {
      return [];
    } finally {
      loading.value = false;
    }
  }

  function setFullData(data: NCMItem[]) {
    fullData.value = data;
    initializeContextWithFullData(data);
  }

  function setFilteredData(data: NCMItem[]) {
    filteredData.value = data;
  }

  function getFilteredData(): NCMItem[] {
    return filteredData.value;
  }

  function getFullData(): NCMItem[] {
    return fullData.value;
  }

  return {
    fullData: readonly(fullData),
    filteredData: readonly(filteredData),
    loading: readonly(loading),
    loadFullData,
    setFullData,
    setFilteredData,
    getFilteredData,
    getFullData,
  };
}
