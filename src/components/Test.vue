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
                                Математический анализ
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
            <v-col cols="12" sm="4" v-if="testFase == allTypesFases[1]">
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
        <v-card v-if="testFase == allTypesFases[1]" class=" text-center pa-3 " style="overflow-y: auto;" min-height="400"
            max-height="400" max-width="350">
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

export default {
    components: { BarChart },
    data: () => ({
        test: {
            time: 10,
            questions: [{
                num: 1,
                answerMode: "text",
                question: "Чему равна производная функции f(x) = 3x^2 при x = 2?",
                correctAnswer: ["12"],
                rewards: {
                    "CHL": 2,
                    "POL": 3,
                    "UMW": 4,
                },
            },
            {
                num: 2,
                answerMode: "text",
                question: "Какие значения x удовлетворяют уравнению 2x - 5 = 0",
                correctAnswer: ["2.5", "2,5"],
                rewards: {
                    "CHL": 1,
                    "POL": 1,
                    "UMW": 1,
                },
            },
            {
                num: 3,
                answerMode: "options",
                answerOptions: ["бесконечность", "не существует", "равен конечному числу"],
                question: "Каков предел функции g(x) = 2x + 1 при x стремящемся к бесконечности?",
                correctAnswer: ["бесконечность"],
                rewards: {
                    "CHL": 2,
                    "POL": 2,
                    "UMW": 2,
                },
            },
            {
                num: 4,
                answerMode: "options",
                question: "Чему равна интегральная сумма функции f(x) = 4x^2 на отрезке [0, 2] при разбиении интервала на 4 равные части?",
                answerOptions: ["4/3", "2/3", "1/3", "3"],
                correctAnswer: ["4/3", "1,33"],
                rewards: {
                    "CHL": 2,
                    "POL": 3,
                    "UMW": 3,
                },
            },
            {
                num: 5,
                question: "Как выразить производную функции f(x) = x^3 по x с помощью степенного правила дифференцирования?",
                correctAnswer: ["3x^2", "3*x^2", "3*x*x"],
                rewards: {
                    "CHL": 2,
                    "POL": 1,
                    "UMW": 4,
                },
            }]
        },
        userAnwsers: {},
        results:{},
        allTypesFases: ["start", "solve", "end"],
        testFase: "start",
        inputAnswer: "",
        numbers: 5,
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
        // firebaseAPI.addNewTest(1,2)
        console.log(this.route.params)
        console.log()
        !useAppStore().isLogged && router.push('/')
        

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
            this.calculationResults()
            this.userAnwsers[this.activeQuestion] = this.inputAnswer
            this.testFase = this.allTypesFases[2]
        },
        calculationResults(){
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
            for (let key in userRewards) {
                userRewards[key] = userRewards[key]/allRewards[key] * 100
            }
            this.results = userRewards
        },
        chartData(): object {

            let chartData = {
                labels: [],
                datasets: [
                    {
                        label: 'Знания в %',
                        backgroundColor: '#36A2EB',
                        data: []
                    }
                ]
            }
            for (let key in this.results) {
                chartData.labels.push(key)
                chartData.datasets[0].data.push(this.results[key])
            }
            chartData.datasets[0].data.push(100)
            return chartData
        }
    },
}

</script>
  