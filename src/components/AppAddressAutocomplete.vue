<template>
   <v-card>
      <p><b>Ім'я:</b> {{ name }}</p>
      <p><b>Прізвище:</b> {{ surname }}</p>
      <p><b>Номер телефону:</b> {{ phoneNumber }}</p>
      <p><b>Email:</b> {{ email }}</p>
      <p><b>Адреса:</b> {{ addressModel?.address }}</p>
      
      <v-btn @click="editData(),  sheet =!sheet" color="primary" class="d-flex justify-center ma-6 mx-auto">Редагувати</v-btn>
      
   </v-card>
   <v-bottom-sheet v-model="sheet">
      <v-card height="500">
      <v-form @submit.prevent="saveData">
         <v-text-field v-model="name" label="Ім'я"></v-text-field>
         <v-text-field v-model="surname" label="Прізвище"></v-text-field>
         <v-text-field v-model="phoneNumber" label="Номер телефону"></v-text-field>
         <v-text-field v-model="email" label="Email"></v-text-field>
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
         <v-btn type="submit" color="primary" @click = "sheet =!sheet">Зберегти</v-btn>
      </v-form>
   </v-card>
   </v-bottom-sheet>
</template>

<script lang='ts' setup>
import { defineEmits, ref } from 'vue'
import debounce from "lodash.debounce"
import AppMap from './AppMap.vue'
import type { AddressItem } from '@/services/map'
import { mapService } from '@/services/map'

const emit = defineEmits<{
   (e: 'select', address: AddressItem): void
}>()
const sheet = ref(false)
const map = mapService()
const name = ref(localStorage.getItem('name') || '')
const surname = ref(localStorage.getItem('surname') || '')
const phoneNumber = ref(localStorage.getItem('phoneNumber') || '')
const email = ref(localStorage.getItem('email') || '')
// const adress = ref(localStorage.getItem('adress') || '')
const editing = ref(false)

const saveData = () => {
   localStorage.setItem('name', name.value)
   localStorage.setItem('surname', surname.value)
   localStorage.setItem('phoneNumber', phoneNumber.value)
   localStorage.setItem('email', email.value)
   localStorage.setItem('adress', addressModel?.value?.address ? addressModel?.value?.address: "Error")
   console.log('Data saved:', name.value, surname.value, phoneNumber.value, email.value)
   editing.value = false
}

const editData = () => {
   editing.value = true
}

const loading = ref<boolean>(false)
const addressModel = ref<AddressItem | null>(null)
const searchModel = ref<string | undefined>(undefined)
const items = ref<AddressItem[] | undefined>([])

const debounceSearch = debounce(search, 1000)

function selectHandler(event: AddressItem): void {
   emit('select', event)
}

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
</script>

<style lang='scss' scoped>
.v-bottom-sheet-overlay {
   display: none;
}
</style>
