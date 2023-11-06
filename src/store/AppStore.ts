// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    isLogged: false,
    fullName:"Не вошел"
  }),
  actions:{
    setIsLogged(set: boolean){

      this.isLogged = set
    },
    setIsFullName(fullName: string){
      this.fullName = fullName
    }
  }
})
