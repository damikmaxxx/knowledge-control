// Utilities
import { defineStore } from 'pinia'

export const useСoursesStore = defineStore('coursesStore', {
  state: () => ({
    courses: [
      {
        id:1,
        name: "Математика",
        img:"https://propowerpoint.ru/fony/matematika/1.jpg",
        tests:[
          {name:"Математический анализ",id:1, teacher: "Дубинин Кузьма Константинович"},
          {name:"Дифференциальные уравнения",id:2, teacher: "Дубинин Кузьма Константинович"},
          {name:"Математическая физика",id:3, teacher: "Дубинин Кузьма Константинович"},
          {name:"Геометрия и топология",id:4, teacher: "Дубинин Кузьма Константинович"}
        ]
      },
      {
        id:2,
        name: "Русский язык",
        img:"https://kartinki.pics/uploads/posts/2021-07/thumbs/1626204693_18-kartinkin-com-p-fon-russkii-yazik-krasivo-20.jpg",
        tests:[
          {name:"Грамматика",id:1, teacher: "Матвиенко Милослава Семеновна",},
          {name:"Лексика и синонимы",id:2, teacher: "Матвиенко Милослава Семеновна",},
          {name:"Чтение и понимание текстов",id:3, teacher: "Крылова Альфия Данисовна",},
          {name:"Письмо и высказывание",id:4, teacher: "Крылова Альфия Данисовна",}
        ]
      },
      {
        id:3,
        name: "Физика",
        img:"https://business-swiss.ch/wp-content/uploads/2021/03/novaija-fizika-780x470.jpg",
        tests:[
          {name:"Кинематика",id:1, teacher: "Мишутин Яков Яромирович",},
          {name:"Динамика",id:2, teacher: "Мишутин Яков Яромирович",},
          {name:"Термодинамика",id:3, teacher: "Мишутин Яков Яромирович",},
          {name:"Электростатика и электродинамика",id:4, teacher: "Мишутин Яков Яромирович",},
          {name:"Оптика",id:4, teacher: "Буслаев Елисей Каримович",},
          {name:"Атомная и ядерная физика",id:4, teacher: "Буслаев Елисей Каримович",}
        ]
      }
    ]
  }),
  actions: {
    addCourse(id_: number, name_:string,img_:string = "") {
      this.courses.push({id:id_,name:name_,img:img_, tests:[]})
    },
  }
})
