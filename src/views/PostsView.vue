<template>
   <home-layout>
      <v-btn v-if="userFarms && userFarms.length > 0" class="custom-btn w-100 mb-2" @click="bottomSheetOpen = true; offersStore.nowOffer = []">Додати товар</v-btn>
     <v-btn v-else class="custom-btn w-100 mb-2nmp" @click="sheet = true">Додати товар</v-btn>

      <v-card >
         <v-card-text>
            <p v-if="farmStore.nowFarm">{{ `Адреса знаходження: ${farmStore.nowFarm.address}` }}</p>
            <p @click='changeFarm = !changeFarm'>Змінити</p>
         </v-card-text>
      </v-card>

     <v-bottom-sheet v-model="sheet">
       <v-card height="500">
         <v-form @submit.prevent="saveData">
           <v-text-field  v-model="name" label="Назва ферми:"></v-text-field>

           <v-autocomplete
               v-model='addressModel'
               v-model:search='searchModel'
               :items='items'
               :loading='loading'
               autocomplete='off'
               item-title='address'
               label='Address'
               prepend-inner-icon='mdi-map-marker-outline'
               :no-filter='true'
               :hide-details='true'
               :return-object='true'
               @update:modelValue='selectHandler'
               @update:search='debounceSearch'
           />
           <app-map v-if="addressModel" />
           <v-btn type="submit" color="primary" @click = "addFarm">Зберегти</v-btn>
         </v-form>
       </v-card>
     </v-bottom-sheet>

      <v-bottom-sheet v-model='changeFarm'>
         <v-card title='Виберіть ферму'>
            <v-card-text>
               <v-row>
                  <v-col cols='12'>
                     <v-select
                        :items="farmStore.farmsId"
                        label="Ферма"
                        item-title="id"
                        v-model="farmStore.nowFarm.id"
                        variant="outlined"

                     >
                        <template v-slot:item="{ props, item }">
                           <v-list-item v-bind="props" :subtitle="item.raw.address" @click='changeFarmFun(item.raw.id)'></v-list-item>
                        </template>
                     </v-select>
                  </v-col>
               </v-row>
            </v-card-text>
         </v-card>
      </v-bottom-sheet>


      <v-bottom-sheet v-model="bottomSheetOpen">
         <v-card title="Інформація про товар">
            <app-select-img-example/>
            <v-form @submit.prevent='addPostLocal'>
            <v-row class='ma-0'>

               <v-col cols='12'>
                  <v-text-field
                     v-model='bodyOffer.title'
                     label='Додати назву'
                     type='text'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='bodyOffer.description'
                     label='Додати опис'
                     type='text'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-select
                     v-model="bodyOffer.category"
                     :items="categories"
                     label="Категорія"
                  ></v-select>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='bodyOffer.price'
                     label='Ціна'
                     type='number'
                  ></v-text-field>

               </v-col>
               <v-col cols='12'>
                  <v-select
                     v-model="bodyOffer.unit"
                     :items="units"
                     label="Одиниця"
                  ></v-select>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='bodyOffer.stock'
                     label='Запас'
                     type='number'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-btn
                     class='mt-2'
                     :block='true'
                     :disabled='isSubmitting || loadingPosts'
                     type='submit'
                     color='primary'
                     @click="bottomSheetOpen = false, addOffer()"
                  >
                     {{ translate('BTNS.ADD_POST') }}
                  </v-btn>
               </v-col>
            </v-row>
         </v-form></v-card>
      </v-bottom-sheet>



      <v-bottom-sheet v-model="EditSheet">
         <v-card title="Редагування товару">
            <app-select-img-example/>

            <v-form @submit.prevent='addPostLocal'>
               <v-row class='ma-0'>
                  <v-col cols='12'>
                     <v-switch
                        v-model="offersStore.nowOffer.status"
                        hide-details
                        color="primary"
                        :label='offersStore.nowOffer.status ==true?"Є в наявності":"Немає в наявності"'

                     ></v-switch>
                  </v-col>

                  <v-col cols='12'>
                    <v-select
                        :items="idfarms"
                        label="Ферма"
                        item-title="id"
                        v-model="offersStore.nowOffer.farm_id"
                        variant="outlined"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :subtitle="item.title"></v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols='12'>
                     <v-text-field
                        v-model='offersStore.nowOffer.title'
                        label='Додати назву'
                        type='text'
                     ></v-text-field>
                  </v-col>
                  <v-col cols='12'>
                     <v-text-field
                        v-model='offersStore.nowOffer.description'
                        label='Додати опис'
                        type='text'
                     ></v-text-field>
                  </v-col>

                  <v-col cols='12'>
                     <v-select
                        v-model="offersStore.nowOffer.category"
                        :items="categories"
                        label="Категорія"
                     ></v-select>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='offersStore.nowOffer.price'
                        label='Ціна'
                        type="Number"
                     ></v-text-field>

                  </v-col>
                  <v-col cols='12'>
                     <v-select
                        v-model="offersStore.nowOffer.unit"
                        :items="units"
                        label="Одиниця"
                     ></v-select>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='offersStore.nowOffer.stock'
                        label='Запас'
                        type='number'
                     ></v-text-field>
                  </v-col>

                  <v-col cols='12'>
                     <v-btn
                        class='mt-2'
                        :block='true'
                        :disabled='isSubmitting || loadingPosts'
                        type='submit'
                        color='primary'
                        @click="changeOffer()"
                     >
<!--                        {{ translate('BTNS.ADD_POST') }}-->
                        Редагувати
                     </v-btn>
                  </v-col>
               </v-row>
            </v-form></v-card>
      </v-bottom-sheet>


      <v-row class='mt-4'>
         <v-col cols='12' v-for='i of offersStore.offers'>
            <v-card
               class='pa-4 h-auto'
               outlined

            >
               <div  >
                  <div class="image-container">
                     <img width="128" :src="linkIMG + '/' + i.image" alt="FFF" class="center-image">
                  </div>
                  <div class="title-container">
                     <p><h2>{{i.title}}</h2></p>
                  </div>
                  <p class='mb-2'><b>Опис: </b>{{i.description}}</p>
                  <p class='mb-2'><b>Категорія: </b> {{i.category}}</p>
                  <p class='mb-2'><b>Ціна: </b>{{i.price}}</p>
                  <p class='mb-2'><b>Одиниця: </b>{{i.unit}}</p>
                  <p class='mb-2'><b>Запас: </b>{{i.stock}}</p>



                  <div @click='updateNameImageNow(i.image); offersStore.nowOffer = i'>
                     <v-card-actions class='d-flex justify-space-between' >
                        <v-btn class="custom-btn" @click="offersStore.croppedImage = null ,EditSheet = true, console.log(nameImage), imageServerToBase64()" >Редагувати</v-btn>
                        <v-btn class="custom-btn delete-btn" @click="deleteOffer(i.id)">Видалити</v-btn>
                     </v-card-actions>
                  </div>

               </div>


            </v-card>
         </v-col>
      </v-row>


   </home-layout>
</template>

<script lang='ts' setup>


import {onMounted, reactive, ref, watch} from 'vue'


import {storeToRefs} from 'pinia'

import type {AddPostBody, changeOffer, createOffer} from '@/models'
import {requestService} from '@/services'
import {useHandleError} from '@/composables'
import {useAppI18n} from '@/i18n'
import {useUserStore} from '@/stores'
import HomeLayout from '@/layouts/HomeLayout.vue'

import AppSelectImgExample from '@/components/AppSelectImgExample.vue'
import {useOffersStore} from '@/stores/offers-store.ts'
import {useFarmStore} from '@/stores/farm-store.ts'

import AppMap from "@/components/AppMap.vue";
import {AddressItem, mapService} from "@/services/map.ts";
import debounce from "lodash.debounce";
import {createFarms} from "@/models";


const userStore = useUserStore()
const nameImage = ref("")
const {currentUser} = storeToRefs(userStore)

const farmStore = useFarmStore()
const {populateFarms} = farmStore
const {farms}=storeToRefs(farmStore)
populateFarms()
const {populate} = userStore
populate()
const linkIMG = 'https://horodyna.grassbusinesslabs.tk/static/'
const offersStore = useOffersStore()
const myText = ref("")
const myPhoto = ref("")
const map = mapService()
const myTitle = ref("")
const changeFarm = ref(false)
const myFarms = ref([])
const myCategory = ref("")
const myPrice = ref(0)
const myUnit = ref("")
const myStock = ref(0)
const bottomSheetOpen = ref(false)
const sheet = ref(false)
const name = ref(localStorage.getItem('name') || '')
const loading = ref<boolean>(false)
const addressModel = ref<AddressItem | null>(null)
const searchModel = ref<string | undefined>(undefined)
const items = ref<AddressItem[] | undefined>([])
const status = ref(true)
const units = ['кг', 'шт']
const {handleError} = useHandleError()
const {translate} = useAppI18n()
const request = requestService()
const loadingPosts = ref<boolean>(false)
const posts = ref<AddPostBody[]>([])
const isSubmitting = ref<boolean>(false)

const EditSheet = ref(false)
const userFarms = farms.value?.items.filter(farm=>farm.user.id===currentUser.value?.id)
let y:any  = []
let idfarms:any = []

const updateNameImageNow = (imageName: string) => {
   offersStore.nameImageNow = imageName
}

const saveData = () => {
  localStorage.setItem('name', name.value)
  localStorage.setItem('adress', addressModel?.value?.address ? addressModel?.value?.address: "Error")
}

const changeFarmFun = async (farmId: number) => {
   try {
      const response = request.getFarmById(farmId).then(res => {
         farmStore.nowFarm = res
      })
   } catch (e) {
      console.log(e)
   }
}
const imageServerToBase64 = () => {
   setTimeout(() => {
      const imagePath = `https://horodyna.grassbusinesslabs.tk/static/${offersStore.nameImageNow}`;

      fetch(imagePath)
         .then(response => response.blob())
         .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
               offersStore.nowImageBase64 = reader.result;
            };
         })
         .catch(error => {
            console.error('Помилка завантаження зображення:', error);
         });
   }, 50)
}

const debounceSearch = debounce(search, 1000)
const emit = defineEmits<{
  (e: 'select', address: AddressItem): void
}>()
const addFarm = () => {
  const spliteedAdress =addressModel.value?addressModel.value?.address.split(","):'error'
  const city = spliteedAdress[2]
  const body:createFarms = {

    name: name.value,
    city: city,
    address: spliteedAdress[0]+","+ spliteedAdress[1]+","+ spliteedAdress[2],
    latitude: 122.21,
    longitude: 122.21
  }

  request.createFarms(body)
  sheet.value=false

}
populateFarms()
async function search(value: string | null): Promise<void> {
  try {
    loading.value = true

    const searchValue: string = value?.trim() || ''

    if (!searchValue) {
      items.value = []
      loading.value = false
      return
    }

    items.value = await map.searchAddresses(searchValue)

    loading.value = false
  } catch (e) {
    console.error(e)
    items.value = []
    loading.value = false
  }
}
function selectHandler(event: AddressItem): void {
  emit('select', event)

}
const categories = ref<string[]>([ 
   'Яблуко','Картопля', 
   'Ковбаса', 
   'Мед', 
   'Груша', 
   'Помідор', 
   'Сало', 
   'Агрус', 
   'Абрикос', 
   'Баклажан', 
   'Диня',
   'Цибуля',
   'інше'
])


const promise = new Promise((resolve) => {
   resolve(userFarms)
})
async function getMyFarm() {
   const res = await request.getFarms()
   const farms = res.items
   farmStore.farms = farms.filter(farm => farm.user.id === userStore.currentUser.id && farmStore.farmsId.push({address: farm.address, id: farm.id}))
   if (farmStore.farms !== null) {
      farmStore.nowFarm = farmStore.farms[0]
   }
}
getMyFarm()


setTimeout(() => {
   for(let i of y){
      console.log(i.id)
      idfarms.push({id:i.id,name:i.name})
   }

}, 10)


let bodyOffer:createOffer = reactive({
   title: '',
   farm_id: 0,
   description: '',
   image: {
      name: '',
      data: ''
   },
   category: '',
   price: 0,
   status: true,
   unit: '',
   stock: 0
})


async function addOffer(){

   const body : createOffer = {
      farm_id:farmStore.nowFarm.id,
      title: bodyOffer.title,
      description: bodyOffer.description,
      image: {
         name: localStorage.getItem('fileName'),
         data: localStorage.getItem('croppedImg')},
      category: bodyOffer.category,
      price: +bodyOffer.price,
      unit: bodyOffer.unit,
      stock: +bodyOffer.stock
   }

   try{
      const response = await request.createOffer(body)
      await getOffer()
      console.log(response)

   }catch (e) {
      console.error(e)
      handleError(e)
   }
}

async function deleteOffer(id: any) {
   try{
      const response = await request.deleteOffer(id)
      await getOffer()

      console.log(response)
   } catch (e) {
      console.log(e)
   }
}
async function changeOffer() {
   const base64String = offersStore.nowImageBase64; // Ваш рядок base64
   const base64Parts = base64String.split(';base64,');
   const base64Name = base64Parts[0].split(':')[1]; // Отримання імені (наприклад, "image/jpeg")
   const base64Data = base64Parts[1]; // Отримання base64-даних
   const body: changeOffer = reactive({
      id: offersStore.nowOffer.id,
      title: offersStore.nowOffer.title,
      description: offersStore.nowOffer.description,
      category: offersStore.nowOffer.category,
      price: +offersStore.nowOffer.price,
      status: offersStore.nowOffer.status,
      unit: offersStore.nowOffer.unit,
      stock: +offersStore.nowOffer.stock,
      farm_id: offersStore.nowOffer.farm_id,
      image: {
         name: base64Name,
         data: base64Data
      }
   })
   try {
      const response = await request.changeOffer(body)
      await getOffer()
      EditSheet.value = false
      console.log(response)
   }
   catch (e) {
      console.log(e)
   }
}

async function getOffer(){
   try{
      const response = await request.getOffers()
      offersStore.offers = response.items
      status.value = response.items.status
      console.log(response)

   }catch (e) {
      console.error(e)
      handleError(e)
   }
}

onMounted(() => {getOffer()})



const addPostLocal = () => {
   const body: AddPostBody = {
      userId: currentUser?.value?.id ?currentUser?.value?.id: -1,
      title: myTitle.value,
      body: myText.value,
      photo: myPhoto.value,
      category: myCategory.value,
      price: myPrice.value,
      unit: myUnit.value,
      stock: myStock.value
   }
   posts.value.push(body)
   myTitle.value = ''
   myText.value = ''
   myPhoto.value = ''
   myCategory.value = ''
   myPrice.value = 0
   myUnit.value = ''
   myStock.value = 0
}
console.log(userFarms)

</script>

<style lang='scss' scoped>

</style>
