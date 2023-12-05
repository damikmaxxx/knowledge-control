import firebase from '@/firebase';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
const db = getDatabase(firebase)
import { useAppStore } from "@/store/AppStore"
interface user{
    id:string,
    fullName: string,
    email: string,
    password: string,
    teacher: boolean     
}

interface RequestTest {
    time:number,
    questions: Question[],
}
interface Question {
  num: number;
  answerMode: string;
  question: string;
  correctAnswer: string[];
  answerOptions?:string[];
  rewards: {
    [key: string]: number;
  };
}


export  const firebaseAPI = {
    addNewUser(userInfo:user){

        const db = getDatabase(firebase)
        const dataRef = ref(db, `users/${userInfo.id}`);
        set(dataRef, {
            fullName: userInfo.fullName,
            email: userInfo.email,
            password: userInfo.password,
            teacher: userInfo.teacher
        }).then(() => {
            console.log('Данные успешно отправлены в Firebase Realtime Database.');
        }).catch((error) => {
            console.error('Ошибка при отправке данных:', error);
        });
    },
    addNewResults(results:object,userId:number,course:number,test:number,){
        const db = getDatabase(firebase)
        console.log(userId,useAppStore().id)
        const dataRef = ref(db, `users/${userId}/results/${course}/${test}`);
        set(dataRef, results).then(() => {
            console.log('Данные успешно отправлены в Firebase Realtime Database.');
        }).catch((error) => {
            console.error('Ошибка при отправке данных:', error);
        });
    },
    addNewTest(course:number,test:number){
        let testQuestions = {
            time: 10,
            questions: [{
                num: 1,
                answerMode: "text",
                question: "Вопрос 1 физ",
                correctAnswer: ["черный"],
                rewards: {
                    "CHL": 1,
                    "POL": 1,
                    "UMN": 1,
                },
            },
            {
                num: 2,
                answerMode: "text",
                question: "Вопрос 2 физ",
                correctAnswer: ["2"],
                rewards: {
                    "CHL": 3,
                    "POL": 1,
                    "UMN": 1,
                },
            },
            {
                num: 3,
                answerMode: "options",
                answerOptions: ["бесконечность", "не существует", "равен конечному числу"],
                question: "Вопрос 3 физ",
                correctAnswer: ["3"],
                rewards: {
                    "CHL": 2,
                    "POL": 2,
                    "UMN": 2,
                },
            },
            {
                num: 4,
                answerMode:"options",
                question:"Вопрос 4 физ",
                answer: ["3","2","1","4"],
                correctAnswer: ["4"],
                rewards: {
                    "CHL": 3,
                    "POL": 3,
                    "UMN": 3,
                },
                
            },]
        }
        const db = getDatabase(firebase)
        const dataRef = ref(db, `questions/${course}/${test}`);
        set(dataRef, testQuestions).then(() => {
            console.log('Данные успешно отправлены в Firebase Realtime Database.');
        }).catch((error) => {
            console.error('Ошибка при отправке данных:', error);
        });
    },
    getQuestions: async function (course:number,test:number): Promise<RequestTest> {
        console.log(`questions/${course}/${test}`)
        const dataRefUserCount2 = ref(db, `questions`);
        new Promise<RequestTest>((resolve, reject) => {
            onValue(dataRefUserCount2, (snapshot) => {
                const data = snapshot.val();
                console.log(snapshot.val())
                resolve(data)
            }, (error) => {
                reject(error);
            });
        });
        const dataRefUserCount = ref(db, `questions/${course}/${test}`);
        return new Promise<RequestTest>((resolve, reject) => {
            onValue(dataRefUserCount, (snapshot) => {
                const data = snapshot.val();
                console.log(snapshot.val())
                resolve(data)
            }, (error) => {
                reject(error);
            });
        });

    },
    getUsersCount: async function (): Promise<number> {
        const dataRefUserCount = ref(db, 'users');
        return new Promise<number>((resolve, reject) => {
            onValue(dataRefUserCount, (snapshot) => {
                const data = snapshot.val();
                resolve(Object.keys(data).length);
            }, (error) => {
                reject(error);
            });
        });

    },
    getUsersByEmailAndPass: async function (email:string,password:string): Promise<object> {
        const dataRefUserCount = ref(db, 'users');
        return new Promise<object>((resolve, reject) => {
            onValue(dataRefUserCount, (snapshot) => {
                const data = snapshot.val();
                for(let key in data){
                   if(data[key].email == email && data[key].password == password) resolve([data[key],key])
                }
                resolve({no:""})
            }, (error) => {
                reject(error);
            });
        });
    
    },
    getUsersRewards: async function (id:number): Promise<object> {
        const dataRefUserCount = ref(db, `users/${id}/results`);
        console.log(id)
        return new Promise<object>((resolve, reject) => {
            onValue(dataRefUserCount, (snapshot) => {
                const data = snapshot.val();
                console.log(data)
                resolve(data)
            }, (error) => {
                reject(error);
            });
        });
    
    },
}
