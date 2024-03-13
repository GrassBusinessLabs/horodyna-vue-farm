<template>
   <div class='crop-image-dialog'>
      <v-dialog v-model='showCropperAdditional' max-width='500' :persistent='true'>
         <v-card class='pt-6 pb-3'>
            <v-card-text class='pb-3'>
               <vue-cropper
                  ref='cropper'
                  class='image-container'
                  :aspect-ratio='1'
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
import {requestService} from '@/services'


const OfferStore = useOffersStore()
const request = requestService()

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

export interface ImageCropperComponentAdditional {
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
const showCropperAdditional = ref<boolean>(false)
const imageFileType = ref<string | null>(null)

async function initCropper(file: File): Promise<void> {
   chosenImage.value = await convertToBase64(file)
   console.log(file.name)
   const regex = /base64,(.*)/
   const matches = chosenImage.value.match(regex)
   showCropperAdditional.value = true
   imageFileType.value = file.type
   await new Promise(resolve => setTimeout(resolve, 50))
   cropper.value!.replace(chosenImage.value!)
   localStorage.setItem('croppedImgAdditional', matches && matches.length > 1?matches[1]:"Error")
}

function hideCropper(): void {
   showCropperAdditional.value = false
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
async function cropChosenImage(): Promise<void> {
      emit('crop', cropper.value!.getCroppedCanvas().toDataURL(imageFileType.value!))
      hideCropper()
   try {
      const res = await request.addAdditionalImage(OfferStore.nowOffer.id, OfferStore.dataAdditionalImage)
      console.log(res)
      setTimeout(async () => {
         await getOfferById()

      }, 30)
   } catch (e) {
      console.log(e)
   }
}

async function convertToBase64(file: File): Promise<string> {
   return new Promise<string>((resolve, reject) => {
      const reader: FileReader = new FileReader()
      reader.readAsDataURL(file)
      console.log(file.name)
      localStorage.setItem('fileNameAdditional', file.name)
      reader.onload = () => {
         if (null !== reader.result && typeof reader.result === 'string') {
            resolve(reader.result)
            console.log(reader.result)
            const base64Image = reader.result;
            const parts = base64Image.split(',');
            const mimeType = parts[0].split(':')[1].split(';')[0];
            const imageData = parts[1];

            const name = "image.png"; // Здесь вы должны установить имя файла в соответствии с вашими потребностями
            const data = `data:${mimeType};base64,${imageData}`;

            console.log("name:", name);
            console.log("data:", data.split(',')[1]);
            useOffersStore().dataAdditionalImage = {name: file.name, data: data.split(',')[1]}

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
