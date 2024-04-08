<template>
  <v-container class="fill-height">
    <v-row no-gutters justify="center">

      <v-col v-if="userInfo.isLogged" v-for="c in courses" :key="c.id" cols="12" sm="4">

        <v-card @click="$router.push(`/course/${c.id}`)" class="mx-auto mt-8 ml-4 mr-4" max-width="344">
          <v-img v-if="!c.img" max-height="200" min-height="200" v-bind:src="'https://dummyimage.com/400x300'"></v-img>
          <v-img v-if="c.img" max-height="200" min-height="200" v-bind:src="server + c.img"></v-img>
          <v-btn @click="openDeleteDialog(c.id, $event)" v-if="userInfo.isLogged && userInfo.isTeacher"
            class="delete-icon">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
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
      <v-col cols="12" sm="4">
        <v-card class="mx-auto mt-8 ml-4 mr-4" max-width="344" @click="() => showLectureDialog = true"
          style="text-align: center;" min-height="300">
          <h2 class="centered-text">Лекция</h2>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" v-if="userInfo.isLogged && userInfo.isTeacher">
        <v-card class="mx-auto mt-8 ml-4 mr-4" max-width="344" @click="() => { showCreateCourseDialog = true }"
          style="text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" fill="none"
            stroke="#1976D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg> </v-card>
      </v-col>
      <!-- Модальное окно с лекцией -->
      <v-dialog v-model="showLectureDialog" max-width="600">
        <v-card>
          <v-card-title>Лекция</v-card-title>
          <v-card-text class="text-lecture">
            <p>
              <strong>Docker</strong> - это платформа для разработки, доставки и запуска приложений в контейнерах.
              Контейнеры
              Docker представляют изолированные среды, включающие в себя приложение и все его зависимости, что
              обеспечивает
              консистентность и портативность работы приложений.
            </p>
            <p>
              Преимущества Docker:
            <ul>
              <li>Унификация окружения разработки</li>
              <li>Ускорение процесса развертывания</li>
              <li>Облегчение масштабирования приложений</li>
              <li>Изоляция приложений и их зависимостей</li>
            </ul>
            </p>
            <p>
              Примеры использования Docker:
            <ul>
              <li>Веб-приложения</li>
              <li>Микросервисная архитектура</li>
              <li>Базы данных</li>
              <li>Разработка в облаке</li>
            </ul>
            </p>

            <p>
              <strong>MongoDB</strong> — документо-ориентированная система управления базами данных, не требующая
              описания
              схемы таблиц. Считается одним из классических примеров NoSQL-систем, использует JSON-подобные документы и
              схему
              базы данных.
            </p>
            <p>
              Особенности MongoDB:
            <ol>
              <li>Кроссплатформенность.</li>
              <li>Формат данных (BSON).</li>
              <li>Документы вместо строк.</li>
              <li>Коллекции вместо таблиц.</li>
              <li>Репликация.</li>
              <li>Индексация.</li>
              <li>Использование GridFS для хранения данных большого размера.</li>
              <li>Поиск по специальным запросам.</li>
              <li>Балансировщик нагрузки.</li>
              <li>Облачное решение.</li>
            </ol>
            </p>
            <p>
              СУБД используют для хранения событий в системе (логирование), записи информации с датчиков мониторинга на
              предприятии, а также в сфере электронной коммерции и мобильных приложений. Часто MongoDB применяют как
              хранилище
              в сфере машинного обучения и искусственного интеллекта. MongoDB относится к классу NoSQL СУБД и работает с
              документами, а не с записями. Это кроссплатформенный продукт, который легко внедряется в любую
              операционную
              систему. Ряд уникальных особенностей позволяет использовать СУБД под определённые задачи, в которых она
              обеспечивает максимальную производительность и надежность.
            </p>

            <p>
              <strong>Redis</strong> — резидентная система управления базами данных класса NoSQL с открытым исходным
              кодом,
              работающая со структурами данных типа «ключ — значение». Используется как для баз данных, так и для
              реализации
              кэшей, брокеров сообщений. Ориентирована на достижение максимальной производительности на атомарных
              операциях.
            </p>
            <p>
              Преимущества Redis:
            <ul>
              <li>Производительность</li>
              <li>Гибкие структуры данных</li>
              <li>Простота и удобство</li>
              <li>Репликация и постоянное хранение</li>
              <li>Высокая доступность и масштабируемость</li>
              <li>Инструменты с открыты</li>
            </ul>
            </p>


          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="showLectureDialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Модальное окно создания теста -->
      <v-dialog v-model="showCreateCourseDialog" max-width="600">
        <v-card>
          <v-card-title>Создание нового курса</v-card-title>
          <v-card-text>
            <v-text-field :rules="[v => !!v || 'Название курса обязательно к заполнению']" v-model="newCourse.name"
              label="Название курса"></v-text-field>
            <v-file-input v-model="fileImgCourse" label="Выберите файл"></v-file-input>
            <!-- <input type="file" ref="fileImgCourse"> -->
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
      <!-- Модальное окно удаления курса -->
      <v-dialog v-model="deleteCourse.dialog" max-width="500">
        <v-card>
          <v-card-title>Удаление курса</v-card-title>
          <v-card-text>
            Вы уверены, что хотите удалить этот курс и все его тесты?
          </v-card-text>
          <v-card-actions>
            <v-btn color="red darken-1" text @click="deleteCourseFunc">Удалить</v-btn>
            <v-btn color="blue darken-1" text @click="deleteCourse.dialog = false">Отмена</v-btn>
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
import { createCourse, deleteCourse, fetchCourses, fetchResultsTest } from '@/http/testsAPI'
export default {
  components: { BarChart },
  data: function () {
    return {
      chartOptions: {
        responsive: true
      },
      visible: false,
      fileImgCourse:null as File | null,
      courses: [],
      server:"http://localhost:5000/",
      usersCourse: useUserStore().courses,
      userInfo: {
        isLogged: useAppStore().isLogged,
        fullName: useAppStore().fullName,
        isTeacher: useAppStore().teacher,
      },
      showLectureDialog: false,
      deleteCourse: {
        dialog: false,
        id: 0,
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
    this.fetchData()
  },
  methods: {
    async fetchData() {
      console.log("sadfa")
      try {
        fetchCourses().then(data => {
          console.log(data)
          useUserStore().setCourse(data)
          this.courses = useUserStore().courses
        })
        fetchResultsTest().then(data => {
          useUserStore().setTestResults(data)
          console.log(data)
          // this.courses = useUserStore().courses
        });
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    },
    createDialogCourse() {
      this.showCreateCourseDialog = true;

    },
    openDeleteDialog(courseId: number, event: any) {
      event.stopPropagation()
      this.deleteCourse.dialog = true
      this.deleteCourse.id = courseId
    },
    deleteCourseFunc() {
      deleteCourse(this.deleteCourse.id)
      this.deleteCourse.dialog = false
      this.fetchData()
    },
    createCourse() {
      const formData = new FormData()
      formData.append('name',this.newCourse.name)
      formData.append('img',this.fileImgCourse)
      console.log(formData.get('img'))
      createCourse(formData)
      this.showCreateCourseDialog = false;
    },
    checkResult: (id: number) => {
      console.log(id)
    },
    chartData(id: number): object {



      // let tests: Array<object> = this.usersCourse.find(el => el.id == id).tests;
      // console.log(tests)

      let chartData = {
        labels: [],
        datasets: [{
          label: 'Знания в %',
          backgroundColor: [],
          data: []
        }],
      }

      // let diffData = { "POL": 0, "CHL": 0, "UMN": 0 }
      let diffData = { "POL": 350, "CHL": 200, "UMN": 300 }
      // let diffCount = 0
      // for (let test of tests) {
      //   for (let r in test.results) {
      //     diffData[r] += test.results[r]
      //   }
      //   diffCount++
      // }
      let diffCount = 4
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
      console.log(chartData)
      chartData.datasets[0].data.push(100)
      return chartData
    }
  }
}

</script>
<style>
.centered-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 100%;
}

.text-lecture {
  padding-left: 30px !important;
}

.delete-icon {
  position: absolute !important;
  top: 0px;
  right: 0px;
  box-shadow: none !important;
  padding: 0px !important;
  min-width: 40px !important;
}
</style>