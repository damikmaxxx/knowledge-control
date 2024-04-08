// Utilities
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        courses: [],
        tests: [],
        testResults: []
    }),
    actions: {
        addCompleteTest(idCource: number, idTest: number, set: object) {
            if (this.courses.filter(el => el.id == idCource).length == 0) {
                this.addCourse(idCource)
            }
            this.courses.filter(el => el.id == idCource)[0].tests.push({ id: idTest, results: set })

        },
        setCourse(_courses: any) {
            this.courses = _courses
        },
        addCourse(id_: number) {
            this.courses.push({ id: id_, tests: [] })
        },
        clearCourses() {
            this.courses = []
        },
        setTests(_tests: any) {
            this.tests = _tests
        },
        setTestResults(_tests: any) {
            this.testResults = _tests
        },
    }

})
