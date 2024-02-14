<template>
   <v-app-bar color='primary'>
      <v-btn icon @click="toggleSidebar" v-if="route.path !== '/sign-in' && route.path !== '/add-address' &&route.path !== '/register'" >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-btn icon @click="goBack" v-if="route.path === '/add-address'">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-app-bar-title>Городина</v-app-bar-title>
   </v-app-bar>

   <v-navigation-drawer v-model="sidebarOpen" app >

      <v-list-item
         prepend-avatar='https://randomuser.me/api/portraits/men/78.jpg'
         class='my-padding'
      >
        <v-list-item-title class='my-subtitle app-font-regular'>{{ currentUser?.name }}</v-list-item-title>
        <v-list-item-subtitle class='my-font-size'>{{ currentUser?.email }}</v-list-item-subtitle>
        <template v-slot:append>
        </template>
      </v-list-item>
     <v-divider thickness='2'></v-divider>
      <v-card class='mx-auto' rounded='lg'>

         <v-card-text>

           <v-btn class='mt-2' :block='true' type='button' variant='text' @click='goToMain'>

             {{ translate('BTNS.MAINPAGE') }}
           </v-btn>

           <v-btn class='mt-2' :block='true' type='button' variant='text' @click='addAdress'>

             {{ translate('BTNS.ADD') }}
           </v-btn>

            <v-btn class='mt-2' :block='true' type='button' variant='text' @click='addAddress()'>
               {{ translate('BTNS.ADD_ADDRESS') }}
            </v-btn>

            <v-btn class='mt-2' :block='true' type='button' variant='text' @click='goToProfile'>
               {{ translate('BTNS.SETTINGS') }}
            </v-btn>

            <v-btn class='mt-2' :block='true' type='button' variant='text' @click='aboutUs'>
               {{ translate('BTNS.ABOUT') }}
            </v-btn>

            <v-btn class='mt-2' :block='true' type='button' variant='text' @click='logout'>
               {{ translate('BTNS.LOGOUT') }}
            </v-btn>
            
         </v-card-text>
      </v-card>
   </v-navigation-drawer>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue'

import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores'
import { useAppI18n } from '@/i18n'

import router from '@/router'

const { translate } = useAppI18n()
const userStore = useUserStore()
const { logout } = userStore
const { currentUser } = storeToRefs(userStore)
const addAddress = () => {
   router.replace("/settings")
}
const sidebarOpen = ref(false)
const route = useRoute()

function toggleSidebar() {
   sidebarOpen.value = !sidebarOpen.value
}

function goBack() {
   router.replace("/posts")
}

// New function to navigate to the profile page
function goToProfile() {
   router.replace("/profile")
}

function goToMain() {
   router.replace("/posts")
}

function aboutUs() {
   router.replace("/about")
}
function addAdress() {
  router.replace("/add-address")
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
   font-size: 1.2rem;
   font-weight: bold;
}

.avatar {
   border-radius: 50%;
}

.my-padding {
  padding: 11.6px;
}
</style>