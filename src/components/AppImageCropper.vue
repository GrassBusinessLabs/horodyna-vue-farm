<template>
   <div class='crop-image-dialog'>
      <v-dialog v-model='showCropper' max-width='500' :persistent='true'>
         <v-card class='pt-6 pb-3'>
            <v-card-text class='pb-3'>
               <vue-cropper
                  ref='cropper'
                  class='image-container'
                  :aspect-ratio='1 / 1'
                  :guides='true'
                  :background='false'
                  :view-mode='3'
                  drag-mode='move'
                  :src='chosenImage'
                  :min-crop-box-width='100'
                  :min-crop-box-height='100'
               >
               </vue-cropper>
            </v-card-text>
            <v-card-actions class='py-0 mx-10'>
               <v-btn
                  @click='hideCropper'
                  variant='text'
                  color='red'
               >
                  Cancel
               </v-btn>
               <v-spacer></v-spacer>
               <v-btn
                  @click='cropChosenImage'
                  variant='text'
                  color='primary'
               >
                  Crop
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script lang='ts' setup>
import {defineEmits, defineExpose, ref} from 'vue'
import VueCropper from 'vue-cropperjs'
import {useOffersStore} from '@/stores/offers-store.ts'

const OfferStore = useOffersStore()

interface CroppedCanvasOptions {
   width: number
   height: number
   minWidth: number
   minHeight: number
   maxWidth: number
   maxHeight: number
   fillColor: string
   imageSmoothingEnabled: boolean
   imageSmoothingQuality: boolean
   rounded: boolean
}

interface Cropper {
   replace: (url: string, hasSameSize?: boolean) => void
   getCroppedCanvas: (options?: CroppedCanvasOptions) => HTMLCanvasElement
}

export interface ImageCropperComponent {
   initCropper: (file: File) => Promise<void>
}

defineExpose({
   initCropper
})

const emit = defineEmits<{
   (e: 'crop', dataURL: string): void
}>()

const cropper = ref<Cropper | null>(null)
const chosenImage = ref<string | null>(null)
const showCropper = ref<boolean>(false)
const imageFileType = ref<string | null>(null)

async function initCropper(file: File): Promise<void> {
   chosenImage.value = await convertToBase64(file)
   console.log(file.name)
   const regex = /base64,(.*)/
   const matches = chosenImage.value.match(regex)

   showCropper.value = true
   imageFileType.value = file.type
   await new Promise(resolve => setTimeout(resolve, 50))
   cropper.value!.replace(chosenImage.value!)
   localStorage.setItem('croppedImg', matches && matches.length > 1?matches[1]:"Error")
}

function hideCropper(): void {
   showCropper.value = false
}

async function cropChosenImage(): Promise<void> {
   emit('crop', cropper.value!.getCroppedCanvas().toDataURL(imageFileType.value!))
   hideCropper()
}

async function convertToBase64(file: File): Promise<string> {
   return new Promise<string>((resolve, reject) => {
      const reader: FileReader = new FileReader()
      reader.readAsDataURL(file)
      console.log(file.name)
      localStorage.setItem('fileName', file.name)
      reader.onload = () => {
         // Perform a null check before resolving the promise
         if (reader.result !== null && typeof reader.result === 'string') {
            resolve(reader.result)
            OfferStore.nowImageBase64 = reader.result

         } else {
            reject(new Error('Failed to read file as string'))
         }
      }
      reader.onerror = error => reject(error)
   })
}



</script>

<style lang='scss'>
.image-container {
   max-width: 450px;
   max-height: 300px;
   overflow: hidden;

   & img {
      width: 100%;
   }
}

span.cropper-point {
   &.point-se {
      width: 5px;
      height: 5px;
      opacity: 0.75;
   }
}
</style>
