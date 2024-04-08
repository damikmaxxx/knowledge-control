<template>
    <v-container class="fill-height">
        <v-row no-gutters justify="center">
            <v-col cols="12" sm="4" v-if="testFase == allTypesFases[0]">
                <v-card class="mx-auto mb-8" min-height="200" min-width="404">

                    <v-card-item>
                        <div>
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                {{ courseName }}
                            </div>
                            <div class="text-caption"><b>Курс:</b> {{ courseName }}</div>
                            <div class="text-caption"><b>Ограничение по времени:</b> {{ timeTest.time/60 }} минуты</div>
                            <div class="text-caption"><b>Количество вопросов:</b> {{ test.questions.length }}</div>
                            <div class="text-caption"><b>Автор:</b>{{ creator }}</div>
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
            <v-col cols="12" sm="4" class="mx-8" v-if="testFase == allTypesFases[1] && numbers != 0" max-width="554">
                <v-card class="mx-auto mb-8" min-height="200" max-width="554">

                    <v-card-item>
                        <div>
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                {{ selectedQuestion()?.text }}
                            </div>
                            <v-text-field label="" v-model="inputAnswer" hide-details></v-text-field>
                            <div class="mt-3 mb-3" style="display: flex; justify-content: end; ">
                                <v-btn min-width="200" @click="nextQuestion"
                                    v-if="activeQuestion != test.questions.length">
                                    Следующий вопрос
                                </v-btn>
                                <v-btn min-width="200" @click="endTestFunc"
                                    v-if="activeQuestion == test.questions.length">
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
                            <div class="text-caption"><b>Тест:</b> {{ testName }}</div>
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
            <v-card v-if="testFase == allTypesFases[1] && numbers != 0" class=" text-center pa-3 "
                style="overflow-y: auto;" min-height="400" max-height="400" max-width="350">
                <div class="text-h6 mb-4 mt-2"><b>Времени осталось:</b> {{ timeSample }}</div>
                <div class="text-h6 mb-4 mt-2">
                    Навигация между вопросами
                </div>
                <v-row>

                    <v-col cols="3" v-for="number in getIndexArray" :key="number">
                        <v-btn @click="changeActiveQuestion(number)">{{ number }}</v-btn>
                    </v-col>
                </v-row>
                <v-btn class="mt-4" @click="endTestFunc">Завершить тест</v-btn>
            </v-card>
        </v-row>

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
import { fetchQuestionTests, fetchInfoTest, CreateResults, fetchResultsTest } from "@/http/testsAPI"

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
        timeTest: {
            time: 10,
            timer: undefined as Timeout | undefined,
        },
        testName: "",
        creator: "",
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
        this.fetchData()
        this.getCourseInfo()

        
    },
    computed: {
        getIndexArray(): Array<string> {
            return this.test.questions.map(el => el.index)
            // return Array.from({ length: this.numbers }, (_, index) => index + 1);
        },
        timeSample(): string {
            let minutes = Math.floor(this.timeTest.time / 60);
            let seconds = this.timeTest.time % 60;

            // Добавляем нуль к секундам, если они меньше 10
            let secondsString = seconds < 10 ? "0" + seconds : seconds;

            let timeSample = minutes + ":" + secondsString;

            return timeSample
        }
    },
    methods: {
        async fetchData() {
            try {
                const questions = await fetchQuestionTests(Number(this.route.params.course), Number(this.route.params.test))
                const { creator, name, courseName } = await fetchInfoTest(Number(this.route.params.course), Number(this.route.params.test))
                this.courseName = courseName
                this.testName = name
                console.log(questions)
                this.test.questions = questions
                this.creator = creator
                this.numbers = questions.length
                this.timeTest.time = this.test.questions.reduce((sum, q) => {
                    return sum + parseInt(q.complexity) * 60
                },0)
            } catch (error) {
                console.error("Error fetching tests:", error);
            }
        },
        startTestFunc() {
            this.testFase = this.allTypesFases[1]
            this.startTimer();
        },
        startTimer() {
            this.timeTest.timer = setInterval(() => {
                this.timeTest.time -= 1
                if (this.timeTest.time <= 0) {
                    clearInterval(this.timeTest.timer);
                    // this.endTestFunc()
                }
            }, 1000)
        },
        goBack() {
            fetchResultsTest().then(data => {
                useUserStore().setTestResults(data)
                console.log(data)
                // this.courses = useUserStore().courses
            });
            router.go(-1);
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
            console.log(this.test.questions.find(el => el.index == this.activeQuestion))
            return this.test.questions.find(el => el.index == this.activeQuestion)

        },
        endTestFunc() {
            this.userAnwsers[this.activeQuestion] = this.inputAnswer

            this.calculationResults()
            // firebaseAPI.addNewResults(this.results, Number(useAppStore().id), Number(this.route.params.course), Number(this.route.params.test))
            this.testFase = this.allTypesFases[2]
            const date = {
                "testId": this.route.params.test,
                "resultsCharacteristic": this.results
            }
            console.log(date)
            console.log(CreateResults(date))

            // let id = useAppStore().id;
            // firebaseAPI.getUsersRewards(Number(id)).then((value) => {
            //     for (let results in value) {
            //         console.log(results)
            //         for (let r in value[results]) {
            //             console.log(r)
            //             useUserStore().addCompleteTest(results, r, value[results][r])
            //         }
            //     }
            // })
        },
        calculationResults() {
            let allRewards = {}
            let userRewards = {}
            this.test.questions.forEach(el => {

                if (allRewards[el.characteristicId] == undefined) {
                    allRewards[el.characteristicId] = el.complexity
                    userRewards[el.characteristicId] = 0
                }
                else {

                    allRewards[el.characteristicId] += el.complexity
                }
            });

            this.test.questions.forEach(el => {
                for (let userAnswer in this.userAnwsers) {
                    if (this.userAnwsers[userAnswer] == el.answer)

                        userRewards[el.characteristicId] += el.complexity

                }
            });

            console.log(allRewards, userRewards)
            for (let key in userRewards) {
                userRewards[key] = Math.round(userRewards[key] / allRewards[key] * 100)

            }
            this.results = userRewards
            console.log(this.results)
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
            const relationCharacteristic = { 1: "UMN", 2: "CHL", 3: "POL" }
            for (let key in this.results) {
                chartData.labels.push(relationCharacteristic[key])
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