<template>
   <auth-layout style="background-color: #f0f0f0;">
      <v-sheet class='mx-auto pa-6 rounded-lg' width='350'>
         <v-form @submit.prevent='submit'>
            <v-row>
               <v-col cols='12'>
                  <v-text-field
                     v-model='username'
                     v-bind='usernameAttrs'
                     label='email'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     type='email'
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

import type {CurrentUser, LoginBody} from '@/models'
import {useHandleError, useRouting} from '@/composables'
import {authTokenService, formService, requestService} from '@/services'
import {useUserStore} from '@/stores'
import AuthLayout from '@/layouts/AuthLayout.vue'
import router from "@/router";

const {handleError} = useHandleError()
const routing = useRouting()
const userStore = useUserStore()
const {setCurrentUser} = userStore

const {vuetifyConfig, usernameValidator, passwordValidator} = formService()
const request = requestService()
const authToken = authTokenService()

const form = useForm({
  validationSchema: toTypedSchema(
      yup.object({
        email: usernameValidator(),
        password: passwordValidator()
      })
  ),
  initialValues: {
    email: 'sa@test.com',
    password: '222222'
  }
})

const isSubmitting = ref<boolean>(false)
const [username, usernameAttrs] = form.defineField('email' as MaybeRefOrGetter, vuetifyConfig)
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

    const body: LoginBody = {
      email: values.email ? values.email : 'Email not found',
      password: values.password
    }

    const currentUser: CurrentUser = await request.login(body)
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
