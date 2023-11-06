<template>
    <v-container class="fill-height">
        <v-row no-gutters justify="center">
            <v-col v-if="isLogged" v-for="t in tests.getTests()" :key="t.id" cols="12" sm="4">
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
                        <v-btn style=" position: absolute; bottom: 10px;">
                            Начать тест
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

export default {
    components: { BarChart },
    data: () => ({

        chartOptions: {
            responsive: true
        },
        visible: false,
        isLogged: useAppStore().isLogged,
        usersCourse: useUserStore().courses,

        tests: {
            getTests: function () {
                const route = useRoute()

                let cource = useСoursesStore().courses.filter(c => {
                    return c.id == route.params.id;
                });
                return cource[0].tests
            },
        },
    }),
    created() {
        !useAppStore().isLogged && router.push('/')
    },
    methods: {
        testComplete(id: number): boolean {
            const route: any = useRoute()
            if(!this.usersCourse.find(el => el.id == route.params.id)){
                return false
            }
            let course = this.usersCourse.find(el => el.id == route.params.id).tests.find(el => el.id == id)
            return course ? true : false
        },
        chartData(id: number): object {
            const route: any = useRoute()
            let test = this.usersCourse[route.params.id - 1].tests.find(el => el.id == id);
            let chartData = {
                labels: [],
                datasets: [{
                    label: 'Знания в %',
                    backgroundColor: ['#36A2EB'],
                    data: []
                }],
            }
            for (let key in test.results) {
                chartData.labels.push(key)
                chartData.datasets[0].data.push(test.results[key])
            }
            chartData.datasets[0].data.push(100)
            return chartData
        }
    },
}

</script>
  