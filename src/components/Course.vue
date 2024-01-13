<template>
    <v-container class="fill-height">
        <v-row no-gutters justify="center">
            <v-col v-if="userInfo.isLogged" v-for="t in tests.getTests()" :key="t.id" cols="12" sm="4">
                <v-card class="mx-auto mb-8" min-height="200" max-width="254">

                    <v-card-item>
                        <div>
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                {{ t.name }}
                            </div>
                            <div class="text-caption"><b>Преподователь:</b> {{ t.teacher }}</div>
                        </div>
                    </v-card-item>

                    <v-card-actions v-if="!testComplete(t.id)">
                        <v-btn @click="goToTest(t.id)" style=" position: absolute; bottom: 10px;">
                            Перейти к тесту
                        </v-btn>
                    </v-card-actions>
                    <v-menu v-if="testComplete(t.id)" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-btn style="width: 100%; position: absolute; bottom: 0px;" v-bind="props"
                                text="Посмотреть результаты">

                            </v-btn>
                        </template>
                        <v-card min-width="300">
                            <BarChart id="my-chart-id" :options="chartOptions" :data="chartData(t.id)" />
                        </v-card>
                    </v-menu>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4" v-if="userInfo.isLogged && userInfo.isTeacher">
                <v-card class="mx-auto ml-4 mr-4 d-flex align-center" min-height="200" max-width="254"
                    @click="createTest" style="justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" fill="none"
                        stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg> </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { useAppStore } from "@/store/AppStore"
import { useСoursesStore } from "@/store/СoursesStore"
import { useUserStore } from "@/store/UserStore"
import { useRouter, useRoute } from 'vue-router'
import router from "@/router/index"
import BarChart from '@/components/BarChart.vue';


interface Course {
    id: number,
    name: string,
    img: string,
    tests: Test[]
}

interface Test {
    id: number,
    name: string,
    teacher: string
}


interface CourseComplete {
    id: number,
    tests: TestComplete[]
}

interface TestComplete {
    id: number,
    results: Results
}

interface Results {
    [key: string]: number;
}

export default {
    components: { BarChart },
    data: () => ({

        chartOptions: {
            responsive: true
        },
        userInfo: {
            isLogged: useAppStore().isLogged,
            fullName: useAppStore().fullName,
            isTeacher: useAppStore().teacher,
        },
        usersCourse: useUserStore().courses,
        route: useRoute(),
        tests: {
            getTests: function () {
                const route = useRoute()

                let courseId = parseInt(route.params.id as string);
                let cource = useСoursesStore().courses.filter((c: Course) => {
                    return c.id == courseId;
                });
                return cource[0].tests
            },
        },
        showCreateTestDialog: false,
        newCourse: {
            name: '',
            image: '',
        },
    }),
    created() {
        !useAppStore().isLogged && router.push('/')
    },

    methods: {
        testComplete(id: number): boolean {
            const route: any = useRoute()
            if (!this.usersCourse.find(el => el.id == route.params.id)) {
                return false
            }
            let courseId = parseInt(route.params.id as string);
            let course = this.usersCourse.find((el: CourseComplete) => el.id == courseId)?.tests.find((el: CourseComplete) => el.id == id)
            return course ? true : false
        },
        createTestDialog() {
            this.showCreateTestDialog = true;

        },
        createTest() {
            let newId = Date.now()
            useСoursesStore().addCourse(newId, this.newCourse.name, this.newCourse.image)
            this.showCreateTestDialog = false;
        },
        chartData(id: number): object {

            const route: any = useRoute()
            console.log(this.usersCourse)
            let test = this.usersCourse.find(el => el.id == route.params.id).tests.find(el => el.id == id);
            let chartData = {
                labels: [],
                datasets: [{
                    label: 'Знания в %',
                    backgroundColor: [],
                    data: []
                }],
            }
            let arrColor = { 60: '#18222C', 75: "#586198", 85: "#7FA8D4", 101: "#C370CA" }

            for (let key in test.results) {
                chartData.labels.push(key)
                chartData.datasets[0].data.push(test.results[key])
                for (let points in arrColor) {
                    if (test.results[key] < Number(points)) {
                        chartData.datasets[0].backgroundColor.push(arrColor[points])
                        break;
                    }

                }

            }
            chartData.datasets[0].data.push(100)
            return chartData
        },
        goToTest(id: number) {
            router.push(`/course/${this.route.params.id}/${id}`)
        }
    },
}

</script>
  