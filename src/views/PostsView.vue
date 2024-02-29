<template>
   <home-layout>
      <v-btn icon='mdi-plus' color='indigo' size='large' class='action-button-add-order'
             @click='bottomSheetOpen = true; offersStore.nowOffer = []'>

      </v-btn>


      <v-card class='order farm-address' :class="{ 'fixed-farm-address': isFixed }" elevation='0'>
         <v-card-text>
            <div class='d-flex'>
               <v-icon @click='changeFarm = !changeFarm' class='ma-2'>
                  mdi-map-marker-outline
               </v-icon>
               <p v-if='farmStore.nowFarm'>{{ farmStore.nowFarm.address.split(',')[0] }}, {{ farmStore.nowFarm.address.split(',')[1] }}, {{ farmStore.nowFarm.city }}</p>
            </div>


         </v-card-text>
      </v-card>

      <v-bottom-sheet v-model='sheet'>
         <v-card height='500'>
            <v-form @submit.prevent='saveData'>
               <v-text-field v-model='name' label='Назва ферми:'></v-text-field>

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
               <app-map v-if='addressModel' />
               <v-btn type='submit' color='primary' @click='addFarm'>Зберегти</v-btn>
            </v-form>
         </v-card>
      </v-bottom-sheet>

      <v-bottom-sheet v-model='changeFarm'>
         <v-card title='Виберіть ферму'>
            <v-card-text>
               <v-row>
                  <v-col cols='12'>
                     <v-list>
                        <div class='item-farm' v-for='i of farmStore.farmsId' >
                           <v-list-item  :class='{"active_farm" : i.id === farmStore.nowFarm.id}'>

                              <template v-slot:prepend>
                                 <div>
                                    <v-icon class='mr-2' >
                                       mdi-map-marker-outline
                                    </v-icon>
                                 </div>
                              </template>
                              <div @click='changeFarmFun(i.id)'>

                                 <v-list-item-title>
                                    {{ i.address.split(',')[0] }} {{i.address.split(',')[1]}}
                                 </v-list-item-title>

                                 <v-list-item-subtitle>
                                    {{i.city}}
                                 </v-list-item-subtitle>
                              </div>

                           </v-list-item>
                        </div>

                     </v-list>
                  </v-col>
               </v-row>
            </v-card-text>
         </v-card>
      </v-bottom-sheet>


      <v-bottom-sheet v-model='bottomSheetOpen'>
         <v-card title='Інформація про товар'>
            <app-select-img-example />
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
                        v-model='bodyOffer.category'
                        :items='categories'
                        label='Категорія'
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
                        v-model='bodyOffer.unit'
                        :items='units'
                        label='Одиниця'
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
                        @click='bottomSheetOpen = false, addOffer()'
                     >
                        {{ translate('BTNS.ADD_POST') }}
                     </v-btn>
                  </v-col>
               </v-row>
            </v-form>
         </v-card>
      </v-bottom-sheet>


      <v-bottom-sheet v-model='EditSheet'>
         <v-card title='Редагування товару'>
            <app-select-img-example />

            <v-form @submit.prevent='addPostLocal'>
               <v-row class='ma-0'>


                  <v-col cols='12'>
                     <v-select
                        :items='farmStore.farmsId'
                        label='Ферма'
                        item-title='id'
                        v-model='offersStore.nowOffer.farm_id'
                        variant='outlined'

                     >
                        <template v-slot:item='{props,  item }'>
                           <v-list-item v-bind='props' :subtitle='item.raw.id' :title='item.raw.address'></v-list-item>
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
                        v-model='offersStore.nowOffer.category'
                        :items='categories'
                        label='Категорія'
                     ></v-select>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='offersStore.nowOffer.price'
                        label='Ціна (грн)'
                        type='Number'
                     ></v-text-field>

                  </v-col>
                  <v-col cols='12'>
                     <v-select
                        v-model='offersStore.nowOffer.unit'
                        :items='units'
                        label='Одиниця'
                     ></v-select>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='offersStore.nowOffer.stock'
                        :label='"Запас" + " " + "(" + offersStore.nowOffer.unit + ")"'
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
                        @click='changeOffer()'
                     >
                        <!--                        {{ translate('BTNS.ADD_POST') }}-->
                        Зберегти
                     </v-btn>
                  </v-col>

                  <v-col cols='12'>
                     <v-btn :block='true' class='custom-btn delete-btn' @click='deleteOffer(offersStore.nowOffer.id)'>
                        Видалити
                     </v-btn>

                  </v-col>
               </v-row>
            </v-form>
         </v-card>
      </v-bottom-sheet>


      <v-row class='order-item mb-6'>
         <v-col cols='12' v-for='i of offersStore.nowFarmOffers' v-if='offersStore.nowFarmOffers.length > 0'>
            <v-card
               elevation='0'
               class='pa-4 h-auto order'

               outlined
               @click='updateNameImageNow(i.image); offersStore.nowOffer = i, offersStore.croppedImage = null ,EditSheet = true, console.log(nameImage), imageServerToBase64()'
            >
               <div :class='{"order-non-active" : i.status === false }'>
                  <div class='title-container mb-3'>
                     <h2 class='title-order'>{{ i.title }}</h2>
                     <p>{{ i.description }}</p>

                  </div>
               </div>

               <div class='d-flex justify-space-between align-center w-100' :class='{"order-non-active" : i.status === false }'>
                  <div>
                     <v-col cols='12'>
                        <div class='image-container '>
                           <img :src="linkIMG + '/' + i.image" alt='FFF' class='center-image image'>
                        </div>
                     </v-col>

                  </div>

                  <div class='w-100'>
                     <v-col cols='12'>
                        <p class='mb-2'>
                           <v-icon>mdi-format-list-bulleted-type</v-icon>
                           {{ i.category }}
                        </p>
                        <p class='mb-2'>
                           <v-icon>mdi-currency-uah</v-icon>
                           {{ i.price }}грн/{{ i.unit }}
                        </p>
                        <p v-if='i.status === true' class='mb-2'>
                           <v-icon>mdi-archive-outline</v-icon>
                           {{ i.stock }} {{ i.unit }}
                        </p>
                        <p v-else class='mb-2'>Немає в наявності</p>
                     </v-col>
                  </div>


               </div>
               <div @click.stop class='switch-status'>
                  <div
                     @click='updateNameImageNow(i.image); offersStore.nowOffer = i, offersStore.croppedImage = null, console.log(nameImage), imageServerToBase64()'>
                     <v-col cols='12'>
                        <v-switch
                           v-model='i.status'
                           hide-details
                           color='primary'
                           @click='statusOffer = !statusOffer'
                           :label='i.status ==true?"Є в наявності":"Немає в наявності"'
                        ></v-switch>
                     </v-col>
                  </div>

               </div>

            </v-card>
         </v-col>

         <v-col v-else>
            <h1 class='text-center'>До цієї ферми товарів не додано</h1>
         </v-col>
      </v-row>

      <v-bottom-sheet v-model='statusOffer' >
         <v-card title='Змінити статус товару'>
            <v-btn class='w-75 mx-auto ma-2' color='#6168DB' @click='changeOffer(offersStore.nowOffer.status); statusOffer = false'>Так</v-btn>
            <v-btn class='w-75 mx-auto' @click='changeOffer(!offersStore.nowOffer.status); statusOffer = false'>Ні</v-btn>
         </v-card>
      </v-bottom-sheet>

   </home-layout>
</template>

<script lang='ts' setup>


import {onMounted, onUnmounted, reactive, ref, watch} from 'vue'


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

import AppMap from '@/components/AppMap.vue'
import {AddressItem, mapService} from '@/services/map.ts'
import debounce from 'lodash.debounce'
import {createFarms} from '@/models'


const userStore = useUserStore()
const nameImage = ref('')
const {currentUser} = storeToRefs(userStore)
const statusOffer = ref(false)
const farmStore = useFarmStore()
const {populateFarms} = farmStore
const {farms} = storeToRefs(farmStore)
populateFarms()
const {populate} = userStore
populate()
const linkIMG = 'https://horodyna.grassbusinesslabs.tk/static/'
const offersStore = useOffersStore()
const myText = ref('')
const myPhoto = ref('')
const map = mapService()
const myTitle = ref('')
const changeFarm = ref(false)
const myFarms = ref([])
const myCategory = ref('')
const myPrice = ref(0)
const myUnit = ref('')
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
const isFixed = ref(false)
const EditSheet = ref(false)
const userFarms = farms.value?.items.filter(farm => farm.user.id === currentUser.value?.id)
let y: any = []
let idfarms: any = []

const updateNameImageNow = (imageName: string) => {
   offersStore.nameImageNow = imageName
}


const handleScroll = () => {
   const scrollY = window.scrollY
   const farmAddressCard = document.querySelector('.farm-address')
   if (farmAddressCard) {
      const farmAddressCardTop = farmAddressCard.getBoundingClientRect().top
      if (scrollY > farmAddressCardTop) {
         isFixed.value = true
      } else {
         isFixed.value = false
      }

   }
}

onMounted(() => {
   window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll)
})

const saveData = () => {
   localStorage.setItem('name', name.value)
   localStorage.setItem('adress', addressModel?.value?.address ? addressModel?.value?.address : 'Error')
}

const changeFarmFun = async (farmId: number) => {
   try {
      const res = await request.getFarmById(farmId)
      farmStore.nowFarm = res
      await getOffersByFarmId()
   } catch (e) {
      console.log(e)
   }
}

const imageServerToBase64 = () => {
   setTimeout(() => {
      const imagePath = `https://horodyna.grassbusinesslabs.tk/static/${offersStore.nameImageNow}`

      fetch(imagePath)
         .then(response => response.blob())
         .then(blob => {
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
               offersStore.nowImageBase64 = reader.result
            }
         })
         .catch(error => {
            console.error('Помилка завантаження зображення:', error)
         })
   }, 50)
}

const debounceSearch = debounce(search, 1000)
const emit = defineEmits<{
   (e: 'select', address: AddressItem): void
}>()
const addFarm = () => {
   const spliteedAdress = addressModel.value ? addressModel.value?.address.split(',') : 'error'
   const city = spliteedAdress[2]
   const body: createFarms = {

      name: name.value,
      city: city,
      address: spliteedAdress[0] + ',' + spliteedAdress[1] + ',' + spliteedAdress[2],
      latitude: 122.21,
      longitude: 122.21
   }

   request.createFarms(body)
   sheet.value = false

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
   'Яблуко', 'Картопля',
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
   farmStore.farmsId = []
   farmStore.farmsAddress = []
   const res = await request.getFarms()
   const farms = res.items
   farmStore.farmsAddress = farms.filter(farm => farm.user.id === userStore.currentUser.id && farmStore.farmsId.push({
      address: farm.address,
      id: farm.id,
      city: farm.city
   }))
   if (farmStore.nowFarm === null) {
      farmStore.nowFarm = farmStore.farmsAddress[0]
   }

}


setTimeout(() => {
   for (let i of y) {
      console.log(i.id)
      idfarms.push({id: i.id, name: i.name})
   }
}, 10)


let bodyOffer: createOffer = reactive({
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


async function addOffer() {

   const body: createOffer = {
      farm_id: farmStore.nowFarm.id,
      title: bodyOffer.title,
      description: bodyOffer.description,
      image: {
         name: localStorage.getItem('fileName'),
         data: localStorage.getItem('croppedImg')
      },
      category: bodyOffer.category,
      price: +bodyOffer.price,
      unit: bodyOffer.unit,
      stock: +bodyOffer.stock
   }

   try {
      const response = await request.createOffer(body)
      await getOffer()
      console.log(response)

   } catch (e) {
      console.error(e)
      handleError(e)
   }
}

async function deleteOffer(id: any) {
   try {
      const response = await request.deleteOffer(id)
      await getOffer()
      EditSheet.value = false
      console.log(response)
   } catch (e) {
      console.log(e)
   }
}

async function changeOffer(status?: boolean) {
   const base64String = offersStore.nowImageBase64
   const base64Parts = base64String.split(';base64,')
   const contentType = base64Parts[0].split(':')[1]
   const base64Data = base64Parts[1]
   const extension = contentType.split('/')[1]
   const imageName = `name.${extension}`


   const body: changeOffer = reactive({
      id: offersStore.nowOffer.id,
      title: offersStore.nowOffer.title,
      description: offersStore.nowOffer.description,
      category: offersStore.nowOffer.category,
      price: +offersStore.nowOffer.price,
      status: status !== undefined ? status : offersStore.nowOffer.status,
      unit: offersStore.nowOffer.unit,
      stock: +offersStore.nowOffer.stock,
      farm_id: offersStore.nowOffer.farm_id,
      image: {
         name: imageName,
         data: base64Data
      }
   })
   try {
      const response = await request.changeOffer(body)
      await getOffer()
      await getOffersByFarmId()
      EditSheet.value = false
      console.log(response)
   } catch (e) {
      console.log(e)
   }
}


async function getOffer() {
   try {
      const response = await request.getOffers()
      offersStore.offers = response.items
      status.value = response.items.status
      console.log(response)

   } catch (e) {
      console.error(e)
      handleError(e)
   }
}

onMounted(async () => {
   await getMyFarm()
   await getOffer()
   await getOffersByFarmId()
})

async function getOffersByFarmId() {
   try {
      const response = await request.getOffersByFarmId(farmStore.nowFarm.id)
      offersStore.nowFarmOffers = response.items
   } catch (e) {
      console.log(e)
   }
}


const addPostLocal = () => {
   const body: AddPostBody = {
      userId: currentUser?.value?.id ? currentUser?.value?.id : -1,
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
.action-button-add-order {
   position: fixed;
   bottom: 20px;
   z-index: 10;
   left: 90%;
   transform: translateX(-50%);
}

.image {
   width: 195px;
   height: 195px;
   border-radius: 5%;
}

.order {
   border-radius: 30px;

}

.title-order {
   color: #6168DB;
}

.farm-address {
   transition: top 0.3s;
}

.order-item {
   margin-top: 10px;
}

.fixed-farm-address {
   position: fixed;
   top: 10px;
   left: 0;
   right: 0;
   margin: 0 15px;
   opacity: 0.9;
   z-index: 1000;
   background-color: #e1e1e1;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   transition: top 0.3s;
}

.order-non-active{
   filter: grayscale(60%);
   opacity: 50%;
   transform: scale(1.02);
}



.active_farm{
   background: #bbbbbb;
   border-radius: 10px;
   color: #fff;
}
.item-farm {
   color: #6168DB;
   margin: 10px;
   border-radius: 10px;
   background: #fff;
   outline: #6168DB 1px ridge;
}

</style>
