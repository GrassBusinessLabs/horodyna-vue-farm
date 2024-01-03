<template>
   <home-layout>
      <v-bottom-sheet v-model="bottomSheetOpen">
         <template v-slot:activator="{ props }">
            <v-card-actions>
               <v-btn class="custom-btn w-100 mb-2nmp " @click="bottomSheetOpen = true">Додати товар</v-btn>
            </v-card-actions>
         </template>
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
                  <v-btn class="custom-btn" @click="showBottomSheet = true">Редагувати</v-btn>
                  <v-btn class="custom-btn delete-btn" @click="showBottomSheet = true">Видалити</v-btn>
               </v-card-actions>

            </v-card>
         </v-col>
      </v-row>

      <v-row class='ma-0'>
         <app-post
            v-for='post in posts'
            :key='Date.now()'
            :post='post'
         />
      </v-row>
   </home-layout>
</template>

<script lang='ts' setup>

import type {MaybeRefOrGetter, Ref} from 'vue'
import {onMounted, reactive, ref} from 'vue'
import {useForm} from 'vee-validate'
import {toTypedSchema} from '@vee-validate/yup'
import {storeToRefs} from 'pinia'
import * as yup from 'yup'
import type {AddPostBody, createOffer, GetPostsResponse, Post} from '@/models'
import {formService, requestService} from '@/services'
import {useHandleError} from '@/composables'
import {useAppI18n} from '@/i18n'
import {useUserStore} from '@/stores'
import HomeLayout from '@/layouts/HomeLayout.vue'
import AppPost from '@/components/AppPost.vue'
import AppSelectImgExample from '@/components/AppSelectImgExample.vue'
import {useOffersStore} from '@/stores/offers-store.ts'

const linkIMG = 'https://horodyna.grassbusinesslabs.tk/static/'
const offersStore = useOffersStore()
const myText = ref("")
const myPhoto = ref(null)
const myTitle = ref("")
const myCategory = ref("")
const myPrice = ref(0)
const myUnit = ref("")
const myStock = ref(0)
const bottomSheetOpen = ref(false)

const categories = []
const namecategories = [{UA: 'Овочі', EN: 'Vegetables'}, {UA: 'Риба', EN: 'Fish'}, {UA: 'Заморожена їда', EN: 'Frozen food'}, {UA: 'Фрукти', EN: 'Fruits'}, {UA: 'Випічка', EN: 'Bakery'}, {UA: 'Солодощі', EN: 'Sweets'}, {UA: 'Здорове харчування', EN: 'Healthy food'}, {UA: "М'ясо", EN: 'Meat'}, {UA: 'Молочні продукти', EN: 'Dairy products'}]

let bodyOffer:createOffer = reactive({
   title: '',
   description: '',
   photo: {
      name: '',
      data: ''
   },
   category: '',
   price: 0,
   unit: '',
   stock: 0
})
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
      getOffer()
      console.log(response)

   }catch (e) {
      console.error(e)
      handleError(e)
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
const status = ref(true)

const units = ['кг', 'шт']

const {handleError} = useHandleError()
const {translate} = useAppI18n()
const userStore = useUserStore()
const {currentUser} = storeToRefs(userStore)

const request = requestService()
const {vuetifyConfig, titleValidator, textValidator} = formService()

const loadingPosts = ref<boolean>(false)

let lastPostId: number = 0

const posts = ref([])

const form = useForm({
   validationSchema: toTypedSchema(
      yup.object({
         title: titleValidator(),
         text: textValidator()
      })
   ),
   initialValues: {
      title: '',
      text: ''
   }
})

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

const submit = form.handleSubmit(async values => {
   try {
      if (isSubmitting.value) {
         return
      }
      isSubmitting.value = true

      const formData = new FormData()
      formData.append('title', myTitle.value)
      formData.append('text', myText.value)
      formData.append('photo', myPhoto.value)
      formData.append('price', myPrice.value)
      formData.append('unit', myUnit.value)
      formData.append('stock', myStock.value)

      const response = await request.addPost(formData)
      const post: Post = response.data
      posts.value.unshift(post)

      form.resetForm()
      myTitle.value = ''
      myText.value = ''
      myPhoto.value = null
      myPrice.value = 0
      myUnit.value = ''
      myStock.value = 0

      isSubmitting.value = false
   } catch (e) {
      console.error(e)
      handleError(e)
      isSubmitting.value = false
   }
})
const getCategories = () => {
   try  {
      const response = request.getCategories().then((response) => {
         for (let i of response.data){
            for(let j of namecategories){
               if (i.name === j.EN){
                  categories.push(j.UA)
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
   myPhoto.value = null
   myCategory.value = ''
   myPrice.value = 0
   myUnit.value = ''
   myStock.value = 0
}
const data = () => ({
   model: 'no',
});

</script>

<style lang='scss' scoped>

</style>
