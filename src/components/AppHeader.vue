<template>
   <v-app-bar color='primary'>
      <v-btn icon @click="toggleSidebar" v-if="route.path !== '/sign-in'">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title>Городина</v-app-bar-title>

      <template v-slot:append>
        <app-select-lang />
      </template>
   </v-app-bar>

   <v-navigation-drawer v-model="sidebarOpen" app >
      <!-- Sidebar content goes here -->
      <v-card
                     class='mx-auto'
                     rounded='lg'
                  >
                     <template v-slot:prepend>
                        <v-avatar
                           v-if='currentUser'
                           color='grey-darken-1'
                           size='32'
                           :image='currentUser.image'
                        ></v-avatar>
                     </template>

                     
                     <template v-slot:title>
                        <span class='card-title'>{{ currentUser?.username }}</span>
                     </template>

                     <v-card-text>
                        <v-btn
                           class='mt-2'
                           :block='true'
                           type='button'
                           variant='text'
                           @click='addAdress()'
                        >
                           {{ translate('BTNS.ADD_ADDRESS') }}
                        </v-btn>
                        <v-btn
                           class='mt-2'
                           :block='true'
                           type='button'
                           variant='text'
                           @click='logout'
                        >
                           {{ translate('BTNS.LOGOUT') }}
                        </v-btn>
                        
                     </v-card-text>
                  </v-card>
   </v-navigation-drawer>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue'
import AppSelectLang from '@/components/AppSelectLang.vue'
import {storeToRefs} from 'pinia'

import {useUserStore} from '@/stores'
import {useAppI18n} from '@/i18n'

import router from '@/router'

const {translate} = useAppI18n()
const userStore = useUserStore()
const {logout} = userStore
const {currentUser} = storeToRefs(userStore)
const addAdress = () => {
   router.replace("/add-address")
}
const sidebarOpen = ref(false)
const route = useRoute()

function toggleSidebar() {
   sidebarOpen.value = !sidebarOpen.value
}
</script>

<style lang='scss' scoped>
.card-title {
   font-size: 1rem;
}

.full-width-btn {
   width: 100%;
}

.nickname {
   margin-top: 8px;
   font-size: 1.2rem; /* Increased font size */
   font-weight: bold;
}

.avatar {
   border-radius: 50%; /* Rounded avatar */
}
</style>
