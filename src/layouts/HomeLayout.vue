<template>
   <v-layout class='rounded rounded-md'>
      <app-header />
      
      <v-main class='bg-grey-lighten-3'>
         <v-container>
            <v-row>


               <v-col>
                  <v-sheet
                      style="background-color: #f0f0f0;"
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
import AppHeader from '@/components/AppHeader.vue'
</script>

<style lang='scss' scoped>
.card-title {
   font-size: 1rem;
}
</style>

