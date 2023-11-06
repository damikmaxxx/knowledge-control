// Utilities
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        courses: [],
        // courses: [
        //     {
        //         id: 1,
        //         tests: [
        //             {
        //                 id: 1, results: {
        //                     "POL": 30,
        //                     "CHL": 80,
        //                     "UMN": 40,
        //                 }
        //             },
        //             {
        //                 id: 3, results: {
        //                     "POL": 0,
        //                     "CHL": 30,
        //                     "UMN": 0,
        //                 }
        //             },
        //             {
        //                 id: 4, results: {
        //                     "POL": 80,
        //                     "CHL": 40,
        //                     "UMN": 10,
        //                 }
        //             },
        //         ]
        //     },
        //     {
        //         id: 2,
        //         tests: [
        //             {
        //                 id: 1, results: {
        //                     "POL": 60,
        //                     "CHL": 80,
        //                     "UMN": 50,
        //                 }
        //             },
        //             {
        //                 id: 2, results: {
        //                     "POL":60,
        //                     "CHL": 80,
        //                     "UMN": 50,
        //                 }
        //             },
        //             {
        //                 id: 3, results: {
        //                     "POL": 0,
        //                     "CHL": 30,
        //                     "UMN": 0,
        //                 }
        //             },
        //             {
        //                 id: 4, results: {
        //                     "POL": 80,
        //                     "CHL": 40,
        //                     "UMN": 10,
        //                 }
        //             },
        //         ]
        //     },
        //     {
        //         id: 3,
        //         tests: [
        //             {
        //                 id: 1, results: {
        //                     "POL": 60,
        //                     "CHL": 80,
        //                     "UMN": 50,
        //                 }
        //             },
        //             {
        //                 id: 2, results: {
        //                     "POL": 60,
        //                     "CHL": 80,
        //                     "UMN": 50,
        //                 }
        //             },
        //             {
        //                 id: 3, results: {
        //                     "POL": 0,
        //                     "CHL": 30,
        //                     "UMN": 0,
        //                 }
        //             },
        //             {
        //                 id: 4, results: {
        //                     "POL": 80,
        //                     "CHL": 40,
        //                     "UMN": 10,
        //                 }
        //             },
        //             {
        //                 id: 5, results: {
        //                     "POL": 80,
        //                     "CHL": 40,
        //                     "UMN": 10,
        //                 }
        //             },
        //             {
        //                 id: 6, results: {
        //                     "POL": 80,
        //                     "CHL": 40,
        //                     "UMN": 10,
        //                 }
        //             },
        //         ]
        //     },
        // ]
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
