<template>
    <v-container class="fill-height">
        <v-row no-gutters justify="center">
            <v-col v-if="userInfo.isLogged" v-for="t in tests" :key="t.id" cols="12" sm="4">

                <v-card class="mx-auto mb-8" min-height="200" max-width="254">
                    <v-btn @click="openChangesDialog(t.id)" v-if="userInfo.isLogged && userInfo.isTeacher"
                        class="three-dots-icon">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    <v-card-item>
                        <div class="card-content">
                            <div class="text-overline mb-1">
                            </div>
                            <div class="text-h6 mb-1">
                                {{ t.name }}
                            </div>
                            <div class="text-caption"><b>Преподователь:</b> {{ t.teacher }}</div>

                        </div>

                    </v-card-item>

                    <v-card-actions v-if=!checkTestCompleted(t.id)>
                        <v-btn @click="goToTest(t.id)" style=" position: absolute; bottom: 10px;">
                            Перейти к тесту
                        </v-btn>
                    </v-card-actions>
                    <v-menu v-if=checkTestCompleted(t.id) :close-on-content-click="false">
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
                    @click="() => { showCreateTestDialog = true }" style="justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" fill="none"
                        stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg> </v-card>
            </v-col>
        </v-row>
        <!-- Модальное окно создания теста -->
        <v-dialog v-model="showCreateTestDialog" max-width="800">
            <v-card>
                <v-card-title>Создание нового теста</v-card-title>
                <v-card-text>
                    <v-text-field :rules="[v => !!v || 'Название теста обязательно к заполнению']"
                        v-model="newTest.name" label="Название Теста"></v-text-field>
                    <!-- Поля для ввода вопросов -->
                    <div v-for="(q, index) in newTest.questions" class="question-row">
                        <v-text-field v-model="q.text" label="Вопрос"></v-text-field>
                        <v-text-field v-model="q.answer" label="Ответ"></v-text-field>
                        <v-select v-model="q.complexity" :items="['1', '2', '3', '4', '5',]"
                            label="Сложность"></v-select>
                        <v-select v-model="q.characteristic" :items="['UMN', 'CHL', 'POL',]"
                            label="Хараткеристика"></v-select>
                        <v-btn @click="removeQuestion(index)" icon>
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>
                    </div>
                    <v-btn @click="addQuestion" color="primary">Добавить вопрос</v-btn>

                    <v-card-text>
                        Преподователь: <b>{{ userInfo.fullName }}</b>
                    </v-card-text>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="createTest" :disabled="!isFormValid">Создать</v-btn>
                    <v-btn @click="showCreateTestDialog = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Модальное окно изменения теста -->
        <v-dialog v-model="testChanges.dialog" max-width="500">
            <v-card>
                <v-card-title>Действия с тестом</v-card-title>
                <!-- <v-card-text>
                    <v-text-field v-model="editedTestName" label="Название Теста"></v-text-field>
                </v-card-text> -->
                <v-card-actions>
                    <v-btn color="red darken-1" @click="deleteTestFunc">Удалить</v-btn>
                    <v-spacer></v-spacer>
                    <!-- <v-btn @click="saveChanges">Сохранить</v-btn> -->
                    <v-btn @click="testChanges.dialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { useAppStore } from "@/store/AppStore"
import { useСoursesStore } from "@/store/СoursesStore"
import { useUserStore } from "@/store/UserStore"
import { useRouter, useRoute } from 'vue-router'
import router from "@/router/index"
import BarChart from '@/components/BarChart.vue';
import { createTest, deleteTest, fetchResultsTest, fetchTests } from "@/http/testsAPI"


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
        tests: useUserStore().tests,
        testResults: useUserStore().testResults,
        completedTests: [],
        showCreateTestDialog: false,
        testChanges:{
            dialog:false,
            activeTestId:0,
        },
        newTest: {
            name: "",

            questions: [{
                text: "1 вопрос",
                complexity: "2",
                answer: "1 ответ",
                characteristic: "UMN"
            }]
        }
    }),
    computed: {
        isFormValid() {
            return !!this.newTest.name;
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            console.log(useRoute())
            try {
                console.log(this.route.params,this.route.params.id)
                const dataTest = await fetchTests(parseInt(this.route.params.id as string));
                useUserStore().setTests(dataTest)
                this.tests = dataTest
                this.testComplete()

            } catch (error) {
                console.error("Error fetching tests:", error);
            }
        },
        openChangesDialog(id:number){
            this.testChanges.dialog = true
            this.testChanges.activeTestId = id
        },
        async deleteTestFunc() {
            await deleteTest(this.testChanges.activeTestId);
            this.testChanges.dialog = false
            this.fetchData()
        },
        addQuestion() {
            this.newTest.questions.push({ text: '', answer: '', complexity: '' });
        },
        removeQuestion(index) {
            this.newTest.questions.splice(index, 1);
        },
        testComplete() {

            this.completedTests = this.tests.filter(t => {
                for (let r in this.testResults) {
                    console.log(this.testResults[r], t)
                    if (this.testResults[r].resultId == t.id) {
                        return true
                    }
                }
            })
        },
        checkTestCompleted(id: number) {
            return this.completedTests.some(el => el.id == id)
        },
        createTestDialog() {
            this.showCreateTestDialog = true;

        },
        createTest() {
            // let newId = Date.now()
            // useСoursesStore().addCourse(newId, this.newCourse.name, this.newCourse.image)
            const relationCharacteristic = { "UMN": 1, "CHL": 2, "POL": 3 }
            const data = {
                name: this.newTest.name,
                courseId: this.route.params.id,
                questions: this.newTest.questions.map(question => ({
                    text: question.text,
                    complexity: question.complexity,
                    answer: question.answer,
                    characteristicId: relationCharacteristic[question.characteristic]
                }))
            }
            console.log(data)
            createTest(data)
            this.showCreateTestDialog = false;
            this.fetchData()
        },

        chartData(id: number): object {

            const route: any = useRoute()
            console.log(this.usersCourse)
            console.log(this.checkTestCompleted(id))

            const results = this.testResults.find(el => el.resultId == id).characteristics
            console.log(results)
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
            //Временно
            let arrColor = { 60: '#18222C', 75: "#586198", 85: "#7FA8D4", 101: "#C370CA" }
            const relationCharacteristic = { 0: "UMN", 1: "CHL", 2: "POL" }

            for (let key in results) {
                chartData.labels.push(relationCharacteristic[key])
                chartData.datasets[0].data.push(results[key].percentageResult)
                for (let points in arrColor) {
                    if (results[key].percentageResult < Number(points)) {

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

<style scoped>
.question-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-right: 10px;
}

.three-dots-icon {
    position: absolute !important;
    top: 0px;
    right: 0px;
    box-shadow: none !important;
    padding: 0px !important;
    min-width: 40px !important;
}

.card-content {
    margin-right: 20px;
}
</style>