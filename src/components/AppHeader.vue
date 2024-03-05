<template>
   <v-app-bar >
      <v-btn icon @click="toggleSidebar" v-if="route.path !== '/sign-in' && route.path !== '/add-address' &&route.path !== '/register' && route.path !== '/pay' && route.path !== '/transactions' " >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-btn icon @click="goBack" v-if="route.path === '/add-address' || route.path === '/pay' || route.path === '/transactions'">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-app-bar-title>Городина</v-app-bar-title>
   </v-app-bar>

   <v-navigation-drawer v-model="sidebarOpen" app >

      <v-list-item
         class='my-padding pl-4 pb-2'
      >
         <v-list-item-title class='my-subtitle app-font-regular'>{{ currentUser?.name }}</v-list-item-title>
         <v-list-item-subtitle class='my-font-size pb-1'>{{ currentUser?.email }}</v-list-item-subtitle>
         <template v-slot:append>
            <v-icon size='27' icon="mdi-chevron-left" @click='sidebarOpen = false'></v-icon>
         </template>
      </v-list-item>
     <v-divider thickness='2'></v-divider>
      <v-card class='mx-auto' elevation='0' rounded='lg'>
         <v-card-text>
            <v-list >
               <v-list-item-subtitle class='my-font-size ml-2 mb-2 mt-1'>
                  ОГЛЯД
               </v-list-item-subtitle>
               <v-list-item
                  class='pl-0 pt-0 mb-0'
                  v-for='i of listMenuReview'
                  :key="i.name"
                  @click='i.routing'
               >
                  <template v-slot:prepend >
                     <v-icon size='27' icon="mdi-chevron-right"></v-icon>
                     <v-icon class='mx-1'>{{i.icon}}</v-icon>
                     <p class='my-font-size ml-2'>{{i.name}}</p>
                  </template>
               </v-list-item>
               <v-list-item-subtitle class='my-font-size ml-2 mb-2 mt-1'>
                  АККАУНТ
               </v-list-item-subtitle>
               <v-list-item
                  class='pl-0 pt-0 mb-0'
                  v-for='j of listMenuAccount'
                  @click='j.routing'
               >
                  <template v-slot:prepend>
                     <v-icon size='27' icon="mdi-chevron-right"></v-icon>
                     <v-icon class='mx-1'>{{j.icon}}</v-icon>
                     <p class='my-font-size ml-2'>{{j.name}}</p>
                  </template>
               </v-list-item>
            </v-list>
            
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

const sidebarOpen = ref(false)
const route = useRoute()

const listMenuReview = [
   {icon: 'mdi-home-outline', name: translate('BTNS.MAINPAGE'), routing: goToMain},
   {icon: 'mdi-home-silo-outline', name: translate('BTNS.ADD'), routing: addAdress},
   {icon: 'mdi-basket-outline', name: translate('BTNS.ORDERS'), routing: goToOrders},
   {icon: 'mdi-currency-uah', name: translate('BTNS.PAY'), routing: goToTransactions},
   {icon: 'mdi-help-circle-outline', name: translate('BTNS.SETTINGS'), routing: goToProfile}
]
const listMenuAccount = [
   {icon: 'mdi-cog-outline', name: translate('BTNS.ADD_ADDRESS'), routing: addAddress},
   {icon: 'mdi-logout', name: translate('BTNS.LOGOUT'), routing: logout},
]

function toggleSidebar() {
   sidebarOpen.value = !sidebarOpen.value
}

function goBack() {
   router.replace("/posts")
}
function addAddress () {
   router.replace("/settings")
}
// New function to navigate to the profile page
function goToProfile() {
   router.replace("/profile")
}

function goToOrders() {
   router.replace("/orders")
}
function goToTransactions() {
   router.replace("/transactions")
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
.v-app-bar{
   background-color: #6168DB;
   color: #fff;
}
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