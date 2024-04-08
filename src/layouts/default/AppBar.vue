<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-row no-gutters>
        <v-col @click="$router.push(`/`)" style="cursor: pointer;" cols="4">
          <v-icon icon="mdi-book-open" />

          Контроль знаний
        </v-col>
        <!-- 

        <v-menu v-if="isLogged" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-col style="cursor: pointer;" cols="3" offset="5" v-bind="props">
              <v-sheet class="pr-10" style="display: flex; justify-content: end;"> {{ fullName }} </v-sheet>
            </v-col>
          </template>

<v-card min-width="300">
  <v-btn class="ma-5" style="width: 100%;" text="Выйти с аккаунта" @click="exitAccount">
    Button
  </v-btn>
</v-card>
</v-menu> -->
        <v-menu v-if="isLogged">
          <template v-slot:activator="{ props }">
            <v-col style="cursor: pointer;" cols="4" offset="8" offset-sm="4" offset-xs="4" v-bind="props">
              <v-sheet class="pr-10" style="display: flex; justify-content: end;"> {{ fullName }} </v-sheet>
            </v-col>
          </template>
          <div>
            <v-btn style="width: 100%;" text="Выйти с аккаунта" @click="exitAccount">
            </v-btn>
          </div>
        </v-menu>
      </v-row>

    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { TEACHER_ROLE, check } from "@/http/userAPI"
import router from "@/router"
import { useAppStore } from "@/store/AppStore"
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";

export default {
  data: () => ({
    router: useRouter(),
    isLoading:true,
  }),
  computed: {
    fullName() {
      return useAppStore().fullName;
    },
    isLogged() {
      return useAppStore().isLogged;
    },
  },
  methods: {
    exitAccount() {
      useAppStore().setIsLogged(false)
      useUserStore().clearCourses()
      this.router.push('/login')
    }
  }
}
</script>
