import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  if (process.client) {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      data.value = JSON.parse(stored)
    }

    watch(data, (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    }, { deep: true })
  }

  return data
}