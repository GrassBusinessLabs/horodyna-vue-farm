<template>
   <v-layout class='rounded rounded-md'>
      <app-header />

      <v-main class='bg-grey-lighten-3'>
         <v-container>
            <v-row>
               <v-col cols='12'>
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
               </v-col>

               <v-col>
                  <v-sheet
                     min-height='70vh'
                     rounded='lg'
                  >
                     <slot />
                  </v-sheet>
               </v-col>
            </v-row>
         </v-container>
      </v-main>
   </v-layout>
</template>

<script lang='ts' setup>
import {storeToRefs} from 'pinia'

import {useUserStore} from '@/stores'
import {useAppI18n} from '@/i18n'
import AppHeader from '@/components/AppHeader.vue'
import router from '@/router'

const {translate} = useAppI18n()
const userStore = useUserStore()
const {logout} = userStore
const {currentUser} = storeToRefs(userStore)
const addAdress = () => {
   router.replace("/add-address")
}
</script>

<style lang='scss' scoped>
.card-title {
   font-size: 1rem;
}
</style>

