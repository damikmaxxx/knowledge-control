// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    isLogged: false,
    fullName:"Не вошел",
    id:"0",
  }),
  actions:{
    setIsLogged(set: boolean){

      this.isLogged = set
    },
    setIsActiveUser(id:string,fullName: string){
      this.fullName = fullName
      this.id = id
    }
  }
})
