<template>
   <home-layout>
      <v-bottom-sheet>
         <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text="Додати товар" class="w-100"></v-btn>
         </template>
         <v-card
            title="Інформація про товар"
         >
            <v-text-field
               class="mt-6"
               label='Додати посилання на фото'
               v-model='myPhoto'
               type='text'
            ></v-text-field>
            <v-form @submit.prevent='addPostLocal'>
            <v-row class='ma-0'>
               <v-col cols='12'>
                  <v-text-field
                     v-model='myTitle'
                     label='Додати назву'
                     type='text'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='myText'
                     label='Додати опис'
                     type='text'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-btn
                     class='mt-2'
                     :block='true'
                     :disabled='isSubmitting || loadingPosts'
                     type='submit'
                     color='primary'
                  >
                     {{ translate('BTNS.ADD_POST') }}
                  </v-btn>
               </v-col>
            </v-row>
         </v-form></v-card>
      </v-bottom-sheet>


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
import {onMounted, ref} from 'vue'
import {useForm} from 'vee-validate'
import {toTypedSchema} from '@vee-validate/yup'
import {storeToRefs} from 'pinia'
import * as yup from 'yup'

import type {AddPostBody, GetPostsResponse, Post} from '@/models'
import {formService, requestService} from '@/services'
import {useHandleError} from '@/composables'
import {useAppI18n} from '@/i18n'
import {useUserStore} from '@/stores'
import HomeLayout from '@/layouts/HomeLayout.vue'
import AppPost from '@/components/AppPost.vue'


const myText = ref("")
const myPhoto = ref("")
const myTitle = ref("")


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

onMounted(() => {
   loadPosts()
})

async function loadPosts(): Promise<void> {
   try {
      loadingPosts.value = true

      const response: GetPostsResponse = await request.getPosts()
      posts.value = response.posts
      lastPostId = response.total

      loadingPosts.value = false
   } catch (e) {
      console.error(e)
      handleError(e)
      posts.value = []
      loadingPosts.value = false
   }
}

const submit = form.handleSubmit(async values => {
   try {
      if (isSubmitting.value) {
         return
      }
      isSubmitting.value = true



      const post: Post = addPostLocal(post)
      post.id = lastPostId + 1
      lastPostId = post.id

      posts.value.unshift(post)

      form.resetForm()

      isSubmitting.value = false
   } catch (e) {
      console.error(e)
      handleError(e)
      isSubmitting.value = false
   }
})

   const addPostLocal = () => {
      const body: AddPostBody = {
         title: myTitle.value,
         body: myText.value,
         photo: myPhoto.value
      }
   posts.value.push(body)
   }
</script>

<style lang='scss' scoped>

</style>

