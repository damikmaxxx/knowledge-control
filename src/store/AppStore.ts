// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    isLogged: false,
    fullName:"Не вошел",
    teacher:false,
    id:"0",
    activeTest:{}
  }),
  actions:{
    setIsLogged(set: boolean){

      this.isLogged = set
      if(!set){
        localStorage.removeItem('token');
      }
    },
    setIsActiveUser(id:string,fullName: string,teacher:boolean){
      this.fullName = fullName
      this.id = id
      this.teacher = teacher
    },
    setActiveTest(test:any){
      this.activeTest = test
    }
  }
})
