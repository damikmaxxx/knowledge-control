<template>
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
        {{ snackbar.message }}
    </v-snackbar>
    <v-container class="fill-height">
        <v-responsive class="align-center text-center fill-height">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <div class="text-subtitle-1 text-medium-emphasis">Вход</div>

                <v-text-field v-model="email" hide-details density="compact" placeholder="Email"
                    prepend-inner-icon="mdi-account-tie" variant="outlined"></v-text-field>

                <v-text-field v-model="password" hide-details :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'" density="compact" placeholder="Введите пароль"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    @click:append-inner="visible = !visible"></v-text-field>

                <v-btn @click="entry" block class="mt-4 " color="blue" size="large" variant="tonal">
                    Войти
                </v-btn>

                <v-card-text class="text-center">
                    <router-link class="text-blue text-decoration-none" to="/registration">Зарегистрироваться <v-icon
                            icon="mdi-chevron-right"></v-icon></router-link>
                </v-card-text>
            </v-card>
        </v-responsive>
    </v-container>
</template>
  
<script lang="ts">
import { useAppStore } from "@/store/AppStore"
import { useUserStore } from "@/store/UserStore"
import router from "@/router/index"
import { firebaseAPI } from "@/api/firebaseApi"

export default {
    data: () => ({
        snackbar: {
            show: false,
            timeout: 3000, // Время отображения уведомления в миллисекундах
            color: "", // Цвет уведомления (может быть динамически изменен)
            vertical: "top", // Установить сверху
            horizontal: "right", // Установить справа
            location:"top",
            message: "",
            absolute:true
        },
        visible: false,
        isLogged: useAppStore().isLogged,
        email: "",
        password: "",
        teacher: false,
    }),
    created() {
        useAppStore().isLogged && router.push('/')
    },
    methods: {
        showNotification(message: string, color: string) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.show = true;
        },
        entry: async function () {
            if (this.email == "" || this.password == "") {
                this.showNotification("Неправильный логин или пароль", "error");
                return
            }
            firebaseAPI.getUsersByEmailAndPass(this.email, this.password).then(value => {
                let dateInfo = value[0]
                let id = value[1]
                console.log(value)
                if (dateInfo.no == "") {
                    console.log("Неправильный ввод")
                    this.showNotification("Неправильный логин или пароль", "error");
                    return
                }
                else {
                    console.log(dateInfo.results)
                    for(let results in dateInfo.results){
                        console.log(results)
                        for(let r in dateInfo.results[results]){
                            console.log(r)
                            useUserStore().addCompleteTest(results,r,dateInfo.results[results][r])
                        }
                    }
                    useAppStore().setIsLogged(true)
                    useAppStore().setIsActiveUser(id,dateInfo.fullName,dateInfo.teacher)
                    router.push('/')
                }
                useUserStore
            }

            );


        },
    }
}

</script>