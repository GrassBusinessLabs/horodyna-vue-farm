<template>
   <auth-layout style="background-color: #f0f0f0;">
      <v-sheet class='mx-auto pa-6 rounded-lg' width='350'>
         <v-form @submit.prevent='submit'>
            <v-row>


               <v-col cols='12'>
                  <v-text-field
                     v-model='phone_number'
                     v-bind='phone_numberAttrs'
                     label='телефон'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     type='text'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='password'
                     v-bind='passwordAttrs'
                     label='пароль'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                     :type="showPassword ? 'text' : 'password'"
                     @click:append-inner='showPassword = !showPassword'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-btn
                     class='mt-2 app-color'
                     :block='true'
                     :disabled='isSubmitting'
                     type='submit'
                  >
                     Вхід
                  </v-btn>
               </v-col>


              <v-col
                  cols='12'
                  class='d-flex justify-center pb-0'
                  @click='toRegister'
              >
                Немає аккаунту?
                <v-list-item-title
                    class='pa-0 ml-1 h-auto w-auto text-capitalize text-blue-accent-4'
                >
                  Реєстрація
                </v-list-item-title>
              </v-col>

            </v-row>
         </v-form>



      </v-sheet>
   </auth-layout>
</template>

<script lang='ts' setup>
import {useForm} from 'vee-validate'
import {toTypedSchema} from '@vee-validate/yup'
import * as yup from 'yup'
import type {MaybeRefOrGetter} from 'vue'
import {ref} from 'vue'

import type {CurrentUser, LoginBody, LoginBodyNumber} from '@/models'
import {useHandleError, useRouting} from '@/composables'
import {authTokenService, formService, requestService} from '@/services'
import {useUserStore} from '@/stores'
import AuthLayout from '@/layouts/AuthLayout.vue'
import router from "@/router";

const {handleError} = useHandleError()
const routing = useRouting()
const userStore = useUserStore()
const {setCurrentUser} = userStore
const {vuetifyConfig, usernameValidator, passwordValidator, phoneNumberValidator} = formService()
const request = requestService()
const authToken = authTokenService()


const form = useForm({
  validationSchema: toTypedSchema(
      yup.object({
         phone_number: phoneNumberValidator(),
         password: passwordValidator()
      })
  ),
  initialValues: {
    phone_number: '+38',
    password: ''
  }
})

const isSubmitting = ref<boolean>(false)
const [username, usernameAttrs] = form.defineField('email' as MaybeRefOrGetter, vuetifyConfig)
const [phone_number, phone_numberAttrs] = form.defineField('phone_number' as MaybeRefOrGetter, vuetifyConfig)
const [password, passwordAttrs] = form.defineField('password' as MaybeRefOrGetter, vuetifyConfig)

const showPassword = ref<boolean>(false)

const toRegister = () => {
  router.replace("/register")
}

const submit = form.handleSubmit(async values => {
  try {
    if (isSubmitting.value) {
      return
    }
    isSubmitting.value = true

    const body: LoginBodyNumber = {
       phone_number: values.phone_number ? values.phone_number : 'phone_number not found',
      password: values.password
    }

    const currentUser: CurrentUser = await request.loginWithNumber(body)
    setCurrentUser(currentUser)
    await authToken.set(currentUser.token)

    await routing.toPosts()

    isSubmitting.value = false
  } catch (e) {
    console.error(e)
    handleError(e)
    isSubmitting.value = false
  }
})

</script>

<style scoped>
.loginWithEmail{
   width: 100%;
   background: #fff;
   outline: 1px solid #6168DB;
   color: #6168DB;
}
</style>