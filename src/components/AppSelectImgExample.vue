<template>
   <input
      ref='fileInputRef'
      type='file'
      accept='image/*'
      hidden
      @change='openImageCropper'
   >

   <input
      ref='fileInputRefAdditional'
      type='file'
      accept='image/*'
      hidden
      class="additional-image"
      @change='openImageCropperAdditional'
   >

   <app-image-cropper
      ref='imageCropperRef'
      @crop='cropHandler'
   />

   <app-image-cropper-additional
      ref='imageCropperRefAdditional'
      @crop='cropHandlerAdditional'
   />

      <v-col cols=12 class='position-relative d-flex'>


         <img
            class='cropped-img'
            v-if='OfferStore.croppedImage'
            :src='OfferStore.croppedImage'
            alt='Cropped image'
         >

<!--         <img class='cropped-img' :src='linkIMG+OfferStore.nowOffer.image' v-if='OfferStore.nowOffer.image'>-->
<!--         <img class='additional-image-img' v-for='i of OfferStore.nowOffer.additional_images'  :src='linkIMG+i.name' alt='' >-->

         <v-carousel :show-arrows="false" v-if='OfferStore.nowOffer.image'>
            <v-carousel-item v-slot:default
               :src='linkIMG+OfferStore.nowOffer.image'
               cover
            >

               <div class='centered-plus' @click='chooseFileAdditional'>
                  <v-icon class='icon-add' size='80'>mdi-plus-circle-outline</v-icon>
               </div>
            </v-carousel-item>

            <v-carousel-item
               v-for='i of OfferStore.nowOffer.additional_images'
               @click='OfferStore.nowAdditionalImage = {idOffer: OfferStore.nowOffer.id, idImage: i.id}'
               :src='linkIMG+i.name'
               cover
            >
               <div class='add-additional-image' @click='chooseFileAdditional'>
                  <v-icon class='icon-add' size='80'>mdi-plus-circle-outline</v-icon>
               </div>

               <div class='btn-delete-additional-image' @click='delAdditionalImage = true'>
                  <v-icon size='80'>mdi-delete-circle-outline</v-icon>
               </div>
            </v-carousel-item>

         </v-carousel>


      </v-col >

<!--   <div class='d-flex position-relative'>-->
<!--      <div class='d-flex additional-images position-relative' v-for='i of OfferStore.nowOffer.additional_images'>-->

<!--&lt;!&ndash;         <img class='additional-image-img'  :src='linkIMG+i.name' alt='' >&ndash;&gt;-->
<!--      </div>-->
<!--   </div>-->







   <v-col cols='12 mt-2'>
      <v-btn
         color='primary'
         :block='true'
         @click='chooseFile'
      >
         Обрати головне зображення
      </v-btn>

   </v-col>

   <v-bottom-sheet v-model='delAdditionalImage'>
      <v-card title='Видалити зображення' >
         <v-btn class='w-75 mx-auto ma-2' color='#6168DB' @click='deleteAdditionalImage(OfferStore.nowAdditionalImage.idOffer, OfferStore.nowAdditionalImage.idImage)'>Так</v-btn>
         <v-btn class='w-75 mx-auto' >Ні</v-btn>
      </v-card>
   </v-bottom-sheet>
</template>

<script lang='ts' setup>
import {onMounted, ref} from 'vue'

import type {ImageCropperComponent} from '@/components/AppImageCropper.vue'
import type {ImageCropperComponentAdditional} from '@/components/AppImageCropperAdditional.vue'
import AppImageCropper from '@/components/AppImageCropper.vue'
import {useOffersStore} from '@/stores/offers-store.ts'
import AppImageCropperAdditional from '@/components/AppImageCropperAdditional.vue'
import {requestService} from '@/services'
import {VBottomSheet} from 'vuetify/components'


const OfferStore = useOffersStore()
const linkIMG = 'https://horodyna.grassbusinesslabs.tk/static/'
const fileInputRef = ref<HTMLInputElement | null>(null)
const fileInputRefAdditional = ref<HTMLInputElement | null>(null)
const imageCropperRef = ref<ImageCropperComponent | null>(null)
const imageCropperRefAdditional = ref<ImageCropperComponentAdditional | null> (null)
const request = requestService()
const delAdditionalImage = ref(false)

function chooseFile(): void {
   if (fileInputRef.value) {

      console.log(fileInputRef.value)
      fileInputRef.value.click()
   }
}

function chooseFileAdditional(): void {
   if (fileInputRefAdditional.value) {
      console.log(fileInputRefAdditional.value)
      fileInputRefAdditional.value.click()
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
async function openImageCropperAdditional(event: Event): Promise<void> {

   if (!event || !imageCropperRefAdditional.value) {
      return
   }
   console.log(event.target)
   const input: HTMLInputElement = event.target as HTMLInputElement;
   console.log(input)

   if (!input.files || !input.files.length) {
      return
   }

   const file: File = input.files![0]
   fileInputRefAdditional.value = null

   imageCropperRefAdditional.value.initCropper(file)
}

function cropHandler(img: string): void {
   OfferStore.croppedImage = img
}
function cropHandlerAdditional(img: string): void {
   OfferStore.croppedImageAdditional = img

}

async function getOfferById() {
   try {
      const res = await request.getOfferById(OfferStore.nowOffer.id)
      OfferStore.nowOffer = res
      console.log(res)
   } catch (e) {
      console.log(e)
   }
}
async function deleteAdditionalImage(idOffer: number, idImage: number) {
   try {
      const res = await request.deleteAdditionalImage(idOffer, idImage)
      await getOfferById()
      delAdditionalImage.value = false
      console.log(res)
   } catch (e) {
      console.log(e)
   }
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
.add-additional-image{
   position: absolute;
   top: 50%;
   left: 60%;
   z-index: 10;
   transform: translate(-50%, -50%);
}
.icon-add{
   color: rgba(255, 255, 255, 0.7);
}
.additional-image-img{
   width: 100%;
}
.additional-images{
   width: 25%;
   margin-left: 5%;
   margin-right: 5%;
   height: 128px;

}
.btn-delete-additional-image{
   position: absolute;
   top: 50%;
   left: 40%;
   transform: translate(-50%, -50%);
   color: rgba(255, 255, 255, 0.7);
}
.centered-plus{
   position: absolute;
   top: 50%;
   left: 50%;
   z-index: 10;
   transform: translate(-50%, -50%);
}
</style>
