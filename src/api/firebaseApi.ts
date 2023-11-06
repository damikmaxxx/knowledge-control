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
    addUsersResult(resultInfo:user){
        // const db = getDatabase(firebase)
        // const dataRef = ref(db, `users/results/${Date.now()}`);
        // // result = {

        // // }
        // set(dataRef, {
        //     fullName: userInfo.fullName,
        //     email: userInfo.email,
        //     password: userInfo.password,
        //     teacher: userInfo.teacher
        // }).then(() => {
        //     console.log('Данные успешно отправлены в Firebase Realtime Database.');
        // }).catch((error) => {
        //     console.error('Ошибка при отправке данных:', error);
        // });

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
