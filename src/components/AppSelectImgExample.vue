<template>
   <input
      ref='fileInputRef'
      type='file'
      accept='image/*'
      hidden
      @change='openImageCropper'
   >

   <app-image-cropper
      ref='imageCropperRef'
      @crop='cropHandler'
   />

   <v-col cols='12'>
      <img
         class='cropped-img'
         v-if='OfferStore.croppedImage'
         :src='OfferStore.croppedImage'
         alt='Cropped image'
      >

      <img class='cropped-img' :src='linkIMG+OfferStore.nowOffer.image' v-else>

   </v-col>

   <v-col cols='12 mt-2'>
      <v-btn
         color='primary'
         :block='true'
         @click='chooseFile'
      >
         Обрати зображення
      </v-btn>
   </v-col>
</template>

<script lang='ts' setup>
import {ref} from 'vue'

import type {ImageCropperComponent} from '@/components/AppImageCropper.vue'
import AppImageCropper from '@/components/AppImageCropper.vue'
import {useOffersStore} from '@/stores/offers-store.ts'

const OfferStore = useOffersStore()
const linkIMG = 'https://horodyna.grassbusinesslabs.tk/static/'
const fileInputRef = ref<HTMLInputElement | null>(null)
const imageCropperRef = ref<ImageCropperComponent | null>(null)


function chooseFile(): void {
   if (fileInputRef.value) {

      console.log(fileInputRef.value)
      fileInputRef.value.click()
   }
}

async function openImageCropper(event: Event): Promise<void> {
   if (!event || !imageCropperRef.value) {
      return
   }

   const input: HTMLInputElement = event.target as HTMLInputElement

   if (!input.files || !input.files.length) {
      return
   }

   const file: File = input.files![0]
   fileInputRef.value = null

   imageCropperRef.value.initCropper(file)
}

function cropHandler(img: string): void {

   OfferStore.croppedImage = img
}
</script>

<style lang='scss' scoped>
.cropped-img {
   max-width: 300px;
   width: 100%;
   border-radius: 4px;
   display: block;
   margin: 0 auto;
}
</style>
