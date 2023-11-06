<template>
  <v-container class="fill-height">
    <v-row no-gutters justify="center">

      <v-col v-if="isLogged" v-for="c in courses" :key="c.id" cols="12" sm="4">
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
      isLogged: useAppStore().isLogged,
      courses: useСoursesStore().courses,
      usersCourse: useUserStore().courses,
    }
  },
  created() {
    !useAppStore().isLogged && router.push('/login')
  },
  methods: {
    checkResult: (id: number) => {
      console.log(id)
    },
    chartData(id: number): object {
      // if (this.usersCourse.find(el => el.id == id).tests) {
      //   let chartData = {
      //     labels: [],
      //     datasets: [{
      //       label: 'Знания в %',
      //       backgroundColor: ['#36A2EB'],
      //       data: []
      //     }],

      //   }
      //   return chartData
      // }
      // else {

      // }
      let tests: Array<object> = this.usersCourse.find(el => el.id == id).tests;
      console.log(tests)

      let chartData = {
        labels: [],
        datasets: [{
          label: 'Знания в %',
          backgroundColor: ['#36A2EB'],
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
      for (let key in diffData) {
        chartData.labels.push(key)
        chartData.datasets[0].data.push(diffData[key])
      }
      chartData.datasets[0].data.push(100)
      return chartData
    }
  }
}

</script>
  