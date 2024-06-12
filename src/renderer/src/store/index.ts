import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    selectedShop: ''
  }),
  actions: {
    setSelectedShop(shopId: string) {
      this.selectedShop = shopId
    }
  }
})
