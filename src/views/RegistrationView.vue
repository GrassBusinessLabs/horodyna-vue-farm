<template>
   <registration-layout style="background-color: #f0f0f0;">
      <v-sheet class='mx-auto pa-6 rounded-lg' width='350'>
         <v-form @submit.prevent='submit'>
            <v-row>
               <v-col cols='12'>
                  <v-text-field
                     v-model='username'
                     v-bind='usernameAttrs'
                     label="Ім'я"
                     :disabled='isSubmitting'
                     :hide-details='true'
                     type='text'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='email'
                     v-bind='emailAttrs'
                     label='Email'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     type='email'
                  ></v-text-field>
               </v-col>

               <v-col cols='12'>
                  <v-text-field
                     v-model='password'
                     v-bind='passwordAttrs'
                     label='Пароль'
                     :disabled='isSubmitting'
                     :hide-details='true'
                     :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                     :type="showPassword ? 'text' : 'password'"
                     @click:append-inner='showPassword = !showPassword'
                  ></v-text-field>
               </v-col>

               <v-col cols='12' class='pb-0'>
                  <v-btn
                     :block='true'
                     :disabled='isSubmitting'
                     type='submit'
                     class='app-color'
                     variant='flat'
                  >
                     Зареєструватися
                  </v-btn>
               </v-col>
               <v-col
                  cols='12'
                  class='pb-0 d-flex justify-center'
                  @click='routing.toSignIn'
               >
                  Вже є аккаунт?
                  <v-list-item-title
                     class='pa-0 ml-1 h-auto w-auto text-capitalize text-blue-accent-4'
                  >
                     Вхід
                  </v-list-item-title>
               </v-col>
            </v-row>
         </v-form>
      </v-sheet>
   </registration-layout>
</template>

<script lang='ts' setup>
import {useForm} from 'vee-validate'
import {toTypedSchema} from '@vee-validate/yup'
import * as yup from 'yup'
import type {MaybeRefOrGetter} from 'vue'
import {ref} from 'vue'

import type {CurrentUser, RegisterBody} from '@/models'
import {useHandleError, useRouting} from '@/composables'
import {authTokenService, formService, requestService} from '@/services'
import {useUserStore} from '@/stores'
import RegistrationLayout from '@/layouts/RegistrationLayout.vue'

const {handleError} = useHandleError()
const routing = useRouting()
const userStore = useUserStore()
const {setCurrentUser} = userStore

const {vuetifyConfig, usernameValidator, passwordValidator, emailValidator} = formService()
const request = requestService()
const authToken = authTokenService()

const form = useForm({
   validationSchema: toTypedSchema(
      yup.object({
         username: usernameValidator(),
         email: emailValidator(),
         password: passwordValidator()
      })
   ),
   initialValues: {
      username: '',
      email: '',
      password: ''
   }
})

const isSubmitting = ref<boolean>(false)
const [username, usernameAttrs] = form.defineField('username' as MaybeRefOrGetter, vuetifyConfig)
const [email, emailAttrs] = form.defineField('email' as MaybeRefOrGetter, vuetifyConfig)
const [password, passwordAttrs] = form.defineField('password' as MaybeRefOrGetter, vuetifyConfig)

const showPassword = ref<boolean>(false)

const submit = form.handleSubmit(async values => {
   try {
      if (isSubmitting.value) {
         return
      }
      isSubmitting.value = true

      const body: RegisterBody = {
         name: values.username ? values.username : 'Name not found',
         email: values.email ? values.email : 'Email not found',
         password: values.password
      }

      const currentUser: CurrentUser = await request.register(body)
      setCurrentUser(currentUser)
      await authToken.set(currentUser.token)

      await routing.toPosts()

      isSubmitting.value = false
      console.log(body)
   } catch (e) {
      console.error(e)
      handleError(e)
      isSubmitting.value = false
   }
})
</script>

<style lang='scss' scoped>

</style>
