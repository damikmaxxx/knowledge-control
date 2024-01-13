<template>
    <v-container class="fill-height">
        <v-row no-gutters justify="center">
            <v-col cols="12" sm="4" v-if="testFase == allTypesFases[0]">
                <v-card class="mx-auto mb-8" min-height="200" max-width="454">

                    <v-card-item>
                        <div>
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                {{ courseName }}
                            </div>
                            <div class="text-caption"><b>Курс:</b> Математика</div>
                            <div class="text-caption"><b>Ограничение по времени:</b> 10 минут</div>
                            <div class="text-caption"><b>Количество вопросов:</b> 15</div>
                            <div
                                style=" width: 100%; display: flex; justify-content: space-between; position: absolute; bottom: 0px; left:0px; padding:1rem;">
                                <v-btn min-width="200" @click="goBack">
                                    Вернуться обратно
                                </v-btn>
                                <v-btn min-width="200" @click="startTestFunc">
                                    Начать тест
                                </v-btn>
                            </div>

                        </div>
                    </v-card-item>
                </v-card>

            </v-col>
            <v-col cols="12" sm="4" v-if="testFase == allTypesFases[1] && numbers != 0">
                <v-card class="mx-auto mb-8" min-height="200" max-width="454">

                    <v-card-item>
                        <div>
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                {{ selectedQuestion()?.question }}
                            </div>
                            <v-text-field label="" v-model="inputAnswer" hide-details></v-text-field>
                            <div class="mt-3 mb-3" style="display: flex; justify-content: end; ">
                                <v-btn min-width="200" @click="nextQuestion" v-if="activeQuestion != test.questions.length">
                                    Следующий вопрос
                                </v-btn>
                                <v-btn min-width="200" @click="endTestFunc" v-if="activeQuestion == test.questions.length">
                                    Завершить тест
                                </v-btn>
                            </div>

                        </div>
                    </v-card-item>
                </v-card>


            </v-col>

            <v-col cols="12" sm="4" v-if="testFase == allTypesFases[2]">
                <v-card class="mx-auto mb-8" min-height="200" max-width="454">

                    <v-card-item>
                        <div>
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                Результаты теста
                            </div>
                            <div class="text-caption"><b>Тест:</b> дискретка</div>
                            <BarChart class="mb-15" id="my-chart-id" :options="chartOptions" :data="chartData()" />
                            <div
                                style=" width: 100%; display: flex; justify-content: space-between; position: absolute; bottom: 0px; left:0px; padding:1rem;">
                                <v-btn min-width="200" @click="goBack">
                                    Вернуться обратно
                                </v-btn>
                            </div>

                        </div>
                    </v-card-item>
                </v-card>

            </v-col>
        </v-row>
        <v-card v-if="testFase == allTypesFases[1] && numbers != 0" class=" text-center pa-3 " style="overflow-y: auto;"
            min-height="400" max-height="400" max-width="350">
            <div class="text-h6 mb-4 mt-2">
                Навигация между вопросами
            </div>
            <v-row>

                <v-col cols="3" v-for="number in getNumbersArray" :key="number">
                    <v-btn @click="changeActiveQuestion(number)">{{ number }}</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<style></style>

  
<script lang="ts">
import { useAppStore } from "@/store/AppStore"
import { useСoursesStore } from "@/store/СoursesStore"
import { useUserStore } from "@/store/UserStore"
import { useRouter, useRoute } from 'vue-router'
import router from "@/router/index"
import BarChart from '@/components/BarChart.vue';
import { firebaseAPI } from "@/api/firebaseApi"

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
interface RequestTest {
    time: number,
    questions: Question[],
}
interface Question {
    num: number;
    answerMode: string;
    question: string;
    correctAnswer: string[];
    answerOptions?: string[];
    rewards: {
        [key: string]: number;
    };
}

export default {

    components: { BarChart },
    data: () => ({
        test: {
            time: 0,
            questions: [],
        },
        courseName: "",
        userAnwsers: {},
        results: {},
        allTypesFases: ["start", "solve", "end"],
        testFase: "start",
        inputAnswer: "",
        numbers: 0,
        activeQuestion: 1,
        activeTest: false,
        endTest: false,
        route: useRoute(),
        chartOptions: {
            responsive: true
        },
        isLogged: useAppStore().isLogged,
        usersCourse: useUserStore().courses,
    }),
    created() {
        // firebaseAPI.addNewTest(3, 2)


        firebaseAPI.getQuestions(Number(this.route.params.course), Number(this.route.params.test)).then((result: RequestTest) => {
            this.test.time = result.time;
            this.test.questions = result.questions;
            this.numbers = result.questions.length;
        });
        console.log(this.route.params)
        console.log()
        !useAppStore().isLogged && router.push('/')
        this.getCourseInfo()
    },
    computed: {
        getNumbersArray(): Array<number> {
            return Array.from({ length: this.numbers }, (_, index) => index + 1);
        }
    },
    methods: {
        startTestFunc() {
            this.testFase = this.allTypesFases[1]
        },
        goBack() {
            router.push(`/course/${this.route.params.course}`)
        },
        getCourseInfo() {
            this.route.params.course
        },
        changeActiveQuestion(num: number) {
            this.userAnwsers[this.activeQuestion] = this.inputAnswer
            this.activeQuestion = num
            this.inputAnswer = this.userAnwsers[this.activeQuestion]
        },
        nextQuestion() {
            this.userAnwsers[this.activeQuestion] = this.inputAnswer
            if (this.activeQuestion < this.test.questions.length) this.activeQuestion++

            this.inputAnswer = this.userAnwsers[this.activeQuestion]
        },
        selectedQuestion() {
            return this.test.questions.find(el => el.num == this.activeQuestion)
        },
        endTestFunc() {
            this.userAnwsers[this.activeQuestion] = this.inputAnswer

            this.calculationResults()
            firebaseAPI.addNewResults(this.results, Number(useAppStore().id), Number(this.route.params.course), Number(this.route.params.test))
            this.testFase = this.allTypesFases[2]
            let id = useAppStore().id;
            firebaseAPI.getUsersRewards(Number(id)).then((value) => {
                for (let results in value) {
                    console.log(results)
                    for (let r in value[results]) {
                        console.log(r)
                        useUserStore().addCompleteTest(results, r, value[results][r])
                    }
                }
            })
        },
        calculationResults() {
            let allRewards = {}
            let userRewards = {}
            this.test.questions.forEach(el => {
                for (let key in el.rewards) {

                    if (allRewards[key] == undefined) {
                        allRewards[key] = el.rewards[key]
                        userRewards[key] = 0
                    }
                    else {
                        allRewards[key] += el.rewards[key]
                    }

                }
            });
            for (let key in this.userAnwsers) {
                let questionKey = this.test.questions.find(el => el.num == key)
                if (this.userAnwsers[key] == undefined || questionKey == undefined) continue
                if (questionKey.correctAnswer.find(el => el == this.userAnwsers[key])) {
                    let rewards = this.test.questions.find(el => el.num == key).rewards
                    for (let key in rewards) {
                        userRewards[key] += rewards[key]

                    }
                }
            }
            console.log(allRewards,userRewards)
            for (let key in userRewards) {
                userRewards[key] = userRewards[key] / allRewards[key] * 100

            }
            this.results = userRewards
        },
        chartData(): object {

            let chartData = {
                labels: [],
                datasets: [
                    {
                        label: 'Знания в %',
                        backgroundColor: [],
                        data: []
                    }
                ]
            }
            let arrColor = { 60: '#18222C', 75: "#586198", 85: "#7FA8D4", 101: "#C370CA" }
            for (let key in this.results) {
                chartData.labels.push(key)
                chartData.datasets[0].data.push(this.results[key])
                for (let points in arrColor) {
                    if (this.results[key] < Number(points)) {

                        chartData.datasets[0].backgroundColor.push(arrColor[points])
                        break;
                    }

                }
            }
            chartData.datasets[0].data.push(100)
            return chartData
        }
    },
}

</script>
  