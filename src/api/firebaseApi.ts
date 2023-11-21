import firebase from '@/firebase';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
const db = getDatabase(firebase)

interface user{
    fullName: string,
    email: string,
    password: string,
    teacher: boolean     
}
export  const firebaseAPI = {
    addNewUser(userInfo:user){

        const db = getDatabase(firebase)
        const dataRef = ref(db, `users/${Date.now()}`);
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
    addNewTest(course:number,test:number){
        let testQuestions = {
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
        }
        const db = getDatabase(firebase)
        const dataRef = ref(db, `questions/${course}/${test}`);
        set(dataRef, testQuestions).then(() => {
            console.log('Данные успешно отправлены в Firebase Realtime Database.');
        }).catch((error) => {
            console.error('Ошибка при отправке данных:', error);
        });
    },
    getQuestions: async function (course:number,test:number): Promise<object> {
        const dataRefUserCount = ref(db, `questions/${course}/${test}`);
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
                   if(data[key].email == email && data[key].password == password) resolve(data[key])
                }
                resolve({no:""})
            }, (error) => {
                reject(error);
            });
        });

    }

    // listenUpdateUser(userId,listensFunc,){
    //     firebase.database().ref(String(userId)).on('value',function(snapshot){
    //         var val = snapshot.val();
    //         listensFunc(val,userId)
    //       });
    // },

    // //UPDATE
    // updateUser(userId,item,count){
    //     firebase.database().ref(String(userId)).child("inventory").update({[item]:count})
    // },
    
    // updateFullUser(userId,obj){
    //     firebase.database().ref(String(userId)).child("inventory").update(obj);
    // },
    // updateEntryTimeBD(userId,time){
    //     firebase.database().ref(String(userId)).child("time").child("timer").update({"entry":time});
    // },

    // updateTimerDB(userId,timerName,info,time){
    //     firebase.database().ref(String(userId)).child("time").child("timer").child(timerName).update({[info]:time});
    // },
    // async updateUnseenDefendInfo({userId,attackingUser,sendInfoDefend,rocketAttack}){
    //     let serverTime = 0
    //     await firebaseAPI.getServerTime().on('value', function(offset) {
    //         const offsetVal = offset.val() || 0;
    //         serverTime = Date.now() + offsetVal;
    //     });
    //     firebase.database().ref(String(userId)).child("unseenInfo").child("defend").child(String(attackingUser)).update({timeAttack:serverTime,attack:rocketAttack,destroyed:sendInfoDefend});
    // },
    // updateClearUnseen(userId){
    //     firebase.database().ref(String(userId)).child("unseenInfo").child("defend").remove();
    // },
    // //GET
    // getTimerDB(userId){
    //     return firebase.database().ref(String(userId)).child("time").child("timer").get()
    // },
    // getServerTime(){
    //     return firebase.database().ref("/.info/serverTimeOffset")
    // },
    // getUserInventory(userId){
    //    return firebase.database().ref(String(userId)).child("inventory").get()
    // },
    // getTimeUserBD(userId){
    //     return firebase.database().ref(String(userId)).child("time").get()
    // },
    // getUnseenInfo(userId){
    //     return firebase.database().ref(String(userId)).child("unseenInfo").get()
    // },
}
