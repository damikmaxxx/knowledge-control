<template>
    <v-container class="fill-height">
        <v-responsive class="align-center text-center fill-height">


            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <div class="text-subtitle-1 text-medium-emphasis">Регистрация</div>
                <v-text-field v-model="email" hide-details density="compact" placeholder="Email"
                    prepend-inner-icon="mdi-email-outline" type="email" variant="outlined"></v-text-field>
                <v-text-field v-model="fullName" hide-details density="compact" placeholder="ФИО"
                    prepend-inner-icon="mdi-account-tie" variant="outlined"></v-text-field>

                <v-text-field v-model="passwordTop" hide-details
                    :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visiblePassword ? 'text' : 'password'" density="compact" placeholder="Введите пароль"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    @click:append-inner="visiblePassword = !visiblePassword"></v-text-field>

                <v-text-field v-model="passwordBottom" hide-details :rules="[passwordRules.required]"
                    :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visiblePassword ? 'text' : 'password'" density="compact" placeholder="Повторите пароль"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    @click:append-inner="visiblePassword = !visiblePassword"></v-text-field>
                <div>
                    <v-checkbox v-model="teacher" label="Я учитель"></v-checkbox>
                </div>
                <v-btn block class="mt-4 " color="blue" size="large" variant="tonal" @click="reg">
                    Зарегистироваться
                </v-btn>

                <v-card-text class="text-center">
                    <router-link class="text-blue text-decoration-none" to="/login">Войти<v-icon
                            icon="mdi-chevron-right"></v-icon></router-link>
                </v-card-text>
            </v-card>
        </v-responsive>
    </v-container>
</template>


<script lang="ts">


import { useAppStore } from "@/store/AppStore"
import router from "@/router/index"
import {firebaseAPI} from "@/api/firebaseApi"
import {registration} from "../http/userAPI"
import { STUDENT_ROLE, TEACHER_ROLE } from "../http/userAPI";
export default {
    data: function () {
        return ({
            visiblePassword: false,
            email: "",
            fullName: "",
            passwordTop: "",
            passwordBottom: "",
            teacher: false,
            useAppStore: useAppStore(),

            passwordRules: {
                required: function (this: any, value: String) {

                    return this.passwordTop === value || "Пароли не совпадают"
                }.bind(this)
            },
        })
    },
    created() {
        
        useAppStore().isLogged && router.push('/')
    },
    methods: {
        reg: async function () {
            if (this.fullName == "" || this.email == "") {
                return
            }
            if ((this.passwordTop != this.passwordBottom) || this.passwordTop == "") {
                return
            }
            
            const response = await registration(this.email,this.fullName,this.passwordBottom,this.teacher ? TEACHER_ROLE : STUDENT_ROLE)
            console.log(response)
            // let newId = String(Date.now())
            // let newUser: User = {
            //     id:newId,
            //     email: this.email,
            //     fullName: this.fullName,
            //     password: this.passwordTop,
            //     teacher: this.teacher,
            // }
            // firebaseAPI.addNewUser(newUser);    

            // useAppStore().setIsLogged(true)
            // useAppStore().setIsActiveUser(newId,this.fullName)
            // router.push('/')
        },
    }
}

</script>