<template>
  <v-app>
    <v-progress-circular class="loading" v-if="isLoading" color="primary" indeterminate></v-progress-circular>

    <template v-else>
      <DefaultBar />
      <DefaultView />
      <DefaultFooter />
    </template>

  </v-app>
</template>

<script lang="ts">
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
import DefaultFooter from './Footer.vue'
import { useRouter } from 'vue-router'
import { TEACHER_ROLE, check } from '@/http/userAPI'
import router from '@/router'
import { useAppStore } from '@/store/AppStore'

export default {
  components: {
    DefaultBar,
    DefaultView,
    DefaultFooter,
  },
  data: () => ({
    router: useRouter(),
    isLoading: true,
  }),
  created() {
    check().then(data => {
      console.log(data)
      const user: any = data
      useAppStore().setIsLogged(true)
      useAppStore().setIsActiveUser(user.id, user.full_name, user.role === TEACHER_ROLE ? true : false)
      router.push('/')
    }).catch(error => {
      console.error('Ошибка:', error.response.data.message);
      router.push('/login')

    }).finally(() => {
      this.isLoading = false
    })
  },
}
</script>

<style scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>