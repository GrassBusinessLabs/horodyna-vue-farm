<template>
   <home-layout>
      <v-btn class="custom-btn w-100 mb-2nmp " @click="bottomSheetOpen = true">Додати товар</v-btn>
      <v-bottom-sheet v-model="bottomSheetOpen">





         <v-card
            title="Інформація про товар"
         >
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
         <v-card
            title="Редагування товару"
         >
            <app-select-img-example/>

            <v-form @submit.prevent='addPostLocal'>
               <v-row class='ma-0'>
                  <v-col cols='12'>
                     <v-text-field
                        v-model='bodyChangeOffer.title'
                        label='Додати назву'
                        type='text'
                     ></v-text-field>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='bodyChangeOffer.description'
                        label='Додати опис'
                        type='text'
                     ></v-text-field>
                  </v-col>

                  <v-col cols='12'>
                     <v-select
                        v-model="bodyChangeOffer.category"
                        :items="categories"
                        label="Категорія"
                     ></v-select>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='bodyChangeOffer.price'
                        label='Ціна'
                        type="Number"
                     ></v-text-field>

                  </v-col>
                  <v-col cols='12'>
                     <v-select
                        v-model="bodyChangeOffer.unit"
                        :items="units"
                        label="Одиниця"
                     ></v-select>
                  </v-col>

                  <v-col cols='12'>
                     <v-text-field
                        v-model='bodyChangeOffer.stock'
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
<!--      <div v-for='i of offersStore.offers'>-->
<!--         {{i.title}}-->
<!--         {{i.description}}-->
<!--         {{i.category}}-->
<!--         {{i.price}}-->
<!--         {{i.unit}}-->
<!--         {{i.stock}}-->
<!--      </div>-->
      <v-row>
         <v-col cols='12' v-for='i of offersStore.offers'>
            <v-card
               class='pa-4'
               outlined
            >
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

               <v-switch
                  v-model="i.status"

               hide-details
                  color="primary"

               :label='i.status ==true?"Є в наявності":"Немає в наявності"'

               ></v-switch>

               <v-card-actions>
                  <v-btn class="custom-btn" @click="idFromOffer(i.id)">Редагувати</v-btn>
                  <v-btn class="custom-btn delete-btn" @click="deleteOffer(i.id)">Видалити</v-btn>
               </v-card-actions>

            </v-card>
         </v-col>
      </v-row>


   </home-layout>
</template>

<script lang='ts' setup>


import {onMounted, reactive, ref} from 'vue'


import {storeToRefs} from 'pinia'

import type {AddPostBody, changeOffer, createOffer} from '@/models'
import {requestService} from '@/services'
import {useHandleError} from '@/composables'
import {useAppI18n} from '@/i18n'
import {useUserStore} from '@/stores'
import HomeLayout from '@/layouts/HomeLayout.vue'

import AppSelectImgExample from '@/components/AppSelectImgExample.vue'
import {useOffersStore} from '@/stores/offers-store.ts'



const linkIMG = 'https://horodyna.grassbusinesslabs.tk/static/'
const offersStore = useOffersStore()
const myText = ref("")
const myPhoto = ref("")
const myTitle = ref("")
const myCategory = ref("")
const myPrice = ref(0)
const myUnit = ref("")
const myStock = ref(0)
const bottomSheetOpen = ref(false)
const EditSheet = ref(false)

const categories = ref<string[]>([])
const namecategories = [{UA: 'Овочі', EN: 'Vegetables'}, {UA: 'Риба', EN: 'Fish'}, {UA: 'Заморожена їда', EN: 'Frozen food'}, {UA: 'Фрукти', EN: 'Fruits'}, {UA: 'Випічка', EN: 'Bakery'}, {UA: 'Солодощі', EN: 'Sweets'}, {UA: 'Здорове харчування', EN: 'Healthy food'}, {UA: "М'ясо", EN: 'Meat'}, {UA: 'Молочні продукти', EN: 'Dairy products'}]

let bodyOffer:createOffer = reactive({
   title: '',
   farm_id: Date.now(),
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

let bodyChangeOffer:changeOffer = reactive({
   id: 0,
   title: '',
   description: '',
   category: '',
   price: 0,
   status: true,
   unit: '',
   stock: +0,
   farm_id: +0,
   image: {
      name: "",
      data: ''
   }
})


 async function idFromOffer(id: any) {
   const response = await request.getOfferById(id)
    bodyChangeOffer = reactive({
       id: id,
       title:response.title,
       description: response.description,
       category: response.category,
       price: +response.price,
       status: response.status,
       unit: response.unit,
       stock: Number(response.stock),
       farm_id: response.farm_id,
       image: {
          name: localStorage.getItem('fileName'),
          data: localStorage.getItem('croppedImg')
       }
 })

   console.log(id)
   EditSheet.value = true


}
async function addOffer(){
   const bodyT : createOffer = {
      farm_id: 9,
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
      const response = await request.createOffer(bodyT)
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
   const bodySend = {
      id: bodyChangeOffer.id,
      title: bodyChangeOffer.title,
      description: bodyChangeOffer.description,
      category: bodyChangeOffer.category,
      price: +bodyChangeOffer.price,
      status: bodyChangeOffer.status,
      unit: bodyChangeOffer.unit,
      stock: +bodyChangeOffer.stock,
      farm_id: bodyChangeOffer.farm_id,
      image: {
         name: bodyChangeOffer.image.name,
         data: bodyChangeOffer.image.data
      }
   }
   try {
      const response = await request.changeOffer(bodySend)
      await getOffer()

      EditSheet.value = false
      console.log(response)
   }
   catch (e) {
      console.log(e)
   }
}

// async function changeOffer() {
//    const changed = {
//
//    }
// }
// async function changeOffers(offer:changeOffer){
//    bodyOffer.title = offer.title
//    bodyOffer.description = offer.description
//    bodyOffer.image.name = offer.image.name
//    bodyOffer.image.data = offer.image.data
//    bodyOffer.category = offer.category
//    bodyOffer.price = offer.price
//    bodyOffer.unit = offer.unit
//    bodyOffer.stock = offer.stock
//
//    const bodyT : changeOffer = {
//
//       farm_id: offer.farm_id,
//       id: offer.id,
//       title: offer.title,
//       description: offer.description,
//       image: {
//          name: offer.image.name,
//          data: offer.image.data},
//       category: offer.category,
//       price: +offer.price,
//       status: offer.status,
//       unit: offer.unit,
//       stock: +offer.stock
//    }
//    try{
//       const response = await request.changeOffer(bodyT)
//
//       console.log(response)
//
//    }catch (e) {
//       console.error(e)
//       handleError(e)
//    }
// }

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
const status = ref(true)

const units = ['кг', 'шт']

const {handleError} = useHandleError()
const {translate} = useAppI18n()
const userStore = useUserStore()
const {currentUser} = storeToRefs(userStore)

const request = requestService()


const loadingPosts = ref<boolean>(false)



const posts = ref<AddPostBody[]>([])



const isSubmitting = ref<boolean>(false)

// onMounted(() => {
//    loadPosts()
// })

// async function loadPosts(): Promise<void> {
//    try {
//       loadingPosts.value = true
//
//       const response: GetPostsResponse = await request.getPosts()
//       posts.value = response.posts
//       lastPostId = response.total
//
//       loadingPosts.value = false
//    } catch (e) {
//       console.error(e)
//       handleError(e)
//       posts.value = []
//       loadingPosts.value = false
//    }
// }


const getCategories = () => {
   try  {
      request.getCategories().then((response) => {
         for (let i of response.data){
            for(let j of namecategories){
               if (i.name === j.EN){
                  categories.value.push(j.UA)
               }
            }


         }

      })
   } catch (e) {
      console.error(e)
      handleError(e)
   }
}
onMounted(() => {
   getCategories()
})

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


</script>

<style lang='scss' scoped>

</style>
