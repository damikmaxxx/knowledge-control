// Utilities
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        courses: [],
    }),
    actions: {
        addCompleteTest(idCource:number,idTest: number, set: object) {
            if(this.courses.filter(el => el.id == idCource).length == 0){
              this.addCourse(idCource) 
            }
            this.courses.filter(el => el.id == idCource)[0].tests.push({id:idTest,results:set})

        },
        addCourse(id_: number) {
            this.courses.push({id:id_, tests:[]})
        },
        clearCourses(){
            this.courses = []
        }
    }

})
