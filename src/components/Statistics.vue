<template>
  <v-container class="fill-height">
    <v-row no-gutters justify="center">

      <v-col v-if="userInfo.isLogged" v-for="c in courses" :key="c.id" cols="12" sm="4">
        <v-card @click="$router.push(`/course/${c.id}`)" class="mx-auto mt-8 ml-4 mr-4" max-width="344">
          <v-img max-height="200" min-height="200" v-bind:src="c.img"></v-img>

          <v-card-text>
            <h2 class="text-h6 text-primary">{{ c.name }}</h2>
          </v-card-text>

          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn style="width: 100%;" v-bind="props" text="Посмотреть результаты">

              </v-btn>
            </template>

            <v-card min-width="300" v-if="usersCourse.find(el => el.id == c.id)">
              <BarChart id="my-chart-id" :options="chartOptions" :data="chartData(c.id)" />

            </v-card>
            <v-card min-width="300" v-if="!usersCourse.find(el => el.id == c.id)">
              <v-card-text>
                <h2 class="text-h6 text-primary">Данных нет</h2>
              </v-card-text>

            </v-card>
          </v-menu>
          <v-overlay contained scrim="#036358" class="align-center justify-center">
            <v-btn variant="flat">Пройти тесты</v-btn>
          </v-overlay>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" v-if="userInfo.isLogged && userInfo.isTeacher">
        <v-card class="mx-auto mt-8 ml-4 mr-4" max-width="344" @click="createDialogCourse" style="text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" fill="none"
            stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg> </v-card>
      </v-col>

      <!-- Модальное окно -->
      <v-dialog v-model="showCreateCourseDialog" max-width="600">
        <v-card>
          <v-card-title>Создание нового курса</v-card-title>
          <v-card-text>
            <v-text-field :rules="[v => !!v || 'Название курса обязательно к заполнению']" v-model="newCourse.name" label="Название курса"></v-text-field>
            <v-text-field v-model="newCourse.image" label="Ссылка на изображение"></v-text-field>
            <v-card-text>
              Преподователь: <b>{{ userInfo.fullName }}</b>
            </v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="createCourse" :disabled="!isFormValid">Создать</v-btn>
            <v-btn @click="showCreateCourseDialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { useAppStore } from "@/store/AppStore"
import { useСoursesStore } from "@/store/СoursesStore"
import { useUserStore } from "@/store/UserStore"
import router from "@/router/index"
import BarChart from '@/components/BarChart.vue';
export default {
  components: { BarChart },
  data: function () {
    return {
      chartOptions: {
        responsive: true
      },
      visible: false,
      
      courses: useСoursesStore().courses,
      usersCourse: useUserStore().courses,
      userInfo: {
        isLogged: useAppStore().isLogged,
        fullName: useAppStore().fullName,
        isTeacher:useAppStore().teacher,
      },
      showCreateCourseDialog: false,
      newCourse: {
        name: '',
        image: '',
      },
    }
  },
  computed: {
    isFormValid() {
      return !!this.newCourse.name;
    }
  },
  created() {
    !useAppStore().isLogged && router.push('/login')

  },
  methods: {
    createDialogCourse() {
      this.showCreateCourseDialog = true;

    },
    createCourse(){
      let newId = Date.now()
      useСoursesStore().addCourse(newId,this.newCourse.name,this.newCourse.image)
      this.showCreateCourseDialog = false;
    },
    checkResult: (id: number) => {
      console.log(id)
    },
    chartData(id: number): object {



      let tests: Array<object> = this.usersCourse.find(el => el.id == id).tests;
      console.log(tests)

      let chartData = {
        labels: [],
        datasets: [{
          label: 'Знания в %',
          backgroundColor: [],
          data: []
        }],
      }
      let diffData = { "POL": 0, "CHL": 0, "UMN": 0 }
      let diffCount = 0
      for (let test of tests) {
        for (let r in test.results) {
          diffData[r] += test.results[r]
        }
        diffCount++
      }

      for (let d in diffData) {
        diffData[d] = diffData[d] / diffCount

      }
      let arrColor = { 60: '#18222C', 75: "#586198", 85: "#7FA8D4", 101: "#C370CA" }
      for (let key in diffData) {
        chartData.labels.push(key)
        chartData.datasets[0].data.push(diffData[key])
        for (let points in arrColor) {
          if (diffData[key] < Number(points)) {

            chartData.datasets[0].backgroundColor.push(arrColor[points])
            break;
          }

        }
      }
      chartData.datasets[0].data.push(100)
      return chartData
    }
  }
}

</script>
  