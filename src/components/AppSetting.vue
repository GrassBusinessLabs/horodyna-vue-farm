<template>
   <v-list-item
      class="pa-0 py-5 px-4 bg-white my-border"
   >
      <v-row>
         <v-col cols='auto' class='pr-4'>
            <v-icon
               :icon="setting.icon"
               size="large"
               class='text-grey-darken-2'
            ></v-icon>
         </v-col>
         <v-col cols='auto' class='pa-0 pt-4 pr-3'>
            <v-list-item-title
               v-text="setting.title"
               class='text-grey-darken-3'
            ></v-list-item-title>
         </v-col>
      </v-row>
      <template v-slot:append>
         <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
   </v-list-item>
</template>

<script setup lang='ts'>
interface Setting {
   title: string
   icon: string
}

defineProps<{
   setting: Setting
}>()
</script>

<style scoped>
.v-list-item-title {
   font-size: 18px;
}

.my-border {
   border-bottom: 3px solid rgba(128, 128, 128, 0.4);
}
</style>