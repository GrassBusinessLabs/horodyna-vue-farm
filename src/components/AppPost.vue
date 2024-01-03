<template>
   <v-col cols='12'>
      <v-card>
         <template v-slot:title class="h-0">
            {{ post.title }}
         </template>
         <v-img class="h-0"
            :width="300"
            aspect-ratio="16/9"
            cover
            :src="post.photo"
         >
         </v-img>

         <v-card-text slot:text class="h-0">
           {{ post.body }}
         </v-card-text>

         <v-card-text slot:text class="h-0">
            <b>Категорія:</b> {{ post.category }}
         </v-card-text>
         <v-card-text slot:text class="h-0">
            Ціна: {{ post.price}}
         </v-card-text>
         <v-card-text slot:text class="h-0">
            Одиниця: {{ post.unit }}
         </v-card-text>
         <v-card-text slot:text>
            Запас: {{ post.stock }}
         </v-card-text>

         <v-card-actions>
            <v-btn text @click="showBottomSheet = true">Редагувати</v-btn>
         </v-card-actions>

         <v-bottom-sheet v-model="showBottomSheet">
            <v-card>
               <v-card-title>Редагувати дані</v-card-title>
               <v-card-text>
                  <v-text-field v-model="post.category" label="Категорія"></v-text-field>
                  <v-text-field v-model="post.price" label="Ціна"></v-text-field>
                  <v-text-field v-model="post.unit" label="Одиниця"></v-text-field>
                  <v-text-field v-model="post.stock" label="Запас"></v-text-field>
                  <v-text-field v-model="post.body" label="Опис"></v-text-field>
               </v-card-text>

               <v-card-actions>
                  <v-btn text @click="showBottomSheet = false">Закрити</v-btn>
                  <v-btn text @click="saveChanges">Зберегти</v-btn>
               </v-card-actions>
            </v-card>
         </v-bottom-sheet>
      </v-card>
   </v-col>
</template>

<script lang='ts' setup>
import { defineProps, ref } from 'vue'
import {useOffersStore} from '@/stores/offers-store.ts'


import type { Post } from '@/models'

defineProps<{
   post: Post
}>()

const showBottomSheet = ref(false)
const offersStore = useOffersStore()
const saveChanges = () => {
   // Save the changes made in the bottom sheet
   // Update the post object with the modified values
   // You can implement your own logic here
   console.log('Saving changes:', post)
}
</script>

<style lang='scss' scoped>

</style>
