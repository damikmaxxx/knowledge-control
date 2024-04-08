import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const createCourse = async (course:FormData) => {
    console.log(course)
    const {data} = await $authHost.post('api/course',  course)
    return data
}
export const deleteCourse = async (id:number) => {
    const {data} = await $authHost.post('api/course/delete', {id})
    return data
}
interface QuestionData {
    text: string;
    complexity: string;
    answer: string;
    characteristicId: string;
  }
  
  interface CreateTestData {
    name: string;
    courseId: number;
    questions: QuestionData[];
  }
export const createTest = async (course:CreateTestData) => {
    const {data} = await $authHost.post('api/test', course)
    return data
}
export const deleteTest = async (id:number) => {
    const {data} = await $authHost.post('api/test/delete', {id})
    return data
}


export const CreateResults = async (results:object) => {
    const {data} = await $authHost.post(`api/result`,results)
    return data
}

export const fetchCourses = async () => {
    const {data} = await $host.get('api/course')
    return data
}

export const fetchOneCourses = async (id:number) => {
    const {data} = await $host.get(`api/course/${id}`)
    return data
}

// export const createTest = async () => {
//     const {data} = await $authHost.post('api/course', course)
//     return data
// }

export const fetchTests = async (courseId:number) => {
    const {data} = await $host.get(`api/test/${courseId}`)
    return data
}

export const fetchQuestionTests = async (courseId:number,id:number) => {
    const {data} = await $host.get(`api/test/${courseId}/${id}`)
    return data
}

export const fetchInfoTest = async (courseId:number,id:number) => {
    const {data} = await $host.get(`api/test/info/${courseId}/${id}`)
    return data
}

export const fetchResultsTest = async () => {
    const {data} = await $authHost.get(`api/result/check`)
    return data
}
