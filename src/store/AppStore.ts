// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    isLogged: false,
    fullName:"Не вошел",
    teacher:false,
    id:"0",
  }),
  actions:{
    setIsLogged(set: boolean){

      this.isLogged = set
    },
    setIsActiveUser(id:string,fullName: string,teacher:boolean){
      this.fullName = fullName
      this.id = id
      this.teacher = teacher
    }
  }
})
