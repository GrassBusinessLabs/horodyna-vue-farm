<template>
   <v-btn icon='mdi-plus' color='indigo' size='large' class='action-button-add-farm'
          @click='sheet =!sheet; name = null'>
   </v-btn>
   <v-card v-if="getMyFarm() !== undefined" class="ma-5 ramka " v-for="farm in getMyFarm()" :key="farm.id" @click='getOrdersByFarmId(farm)'>

     <div class="ma-2">
         <div class='d-flex align-center'>
            <v-icon>mdi-home-silo-outline</v-icon>
            <div class='ml-3'>
               <p class='title-farm'><b>{{ farm.name }}</b></p>
               <p class='title-farm' id='address'><b>{{farm.address.split(',')[0]}} {{farm.address.split(',')[1]}}</b></p>
            </div>
         </div>



        <div class='d-flex align-center'>
           <v-icon>mdi-map-marker-outline</v-icon>
           <p class='ml-3' v-if='farm.city'>{{ farm.city }}</p> <br>
        </div>

        <div class='mt-2 d-flex justify-end w-100' @click.stop>
           <v-btn icon='mdi-pencil-outline' class='ma-1' elevation='0' size='small' @click='editFarm(farm)' ></v-btn>
           <v-btn icon='mdi-delete-outline' class='ma-1' elevation='0' size='small' @click='deleteFarmSheet = true; farmStore.nowFarmId = farm.id'></v-btn>
        </div>
     </div>

   </v-card>
   <v-bottom-sheet v-model="sheet">
      <v-card >
         <v-card-text>
            <v-form @submit.prevent="saveData">
               <v-text-field v-model="name" label="Назва ферми" ></v-text-field>

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
            </v-form>
         </v-card-text>
         <app-map />
         <v-card-actions>
            <v-btn type="submit" color="primary" @click = "addFarm()" class="custom-btn w-100">Зберегти</v-btn>
         </v-card-actions>

   </v-card>
   </v-bottom-sheet>

   <v-bottom-sheet v-model='deleteFarmSheet'>
      <v-card title='Ви хочете видалити ферму?'>
         <v-btn color='#6168DB' @click='deleteFarm()'>Так</v-btn>
         <v-btn @click='deleteFarmSheet = false'>Ні</v-btn>
      </v-card>
   </v-bottom-sheet>



   <v-bottom-sheet v-model="updateFarmSheet">
      <v-card >
         <v-card-text>
            <v-form @submit.prevent="saveData">
               <v-text-field v-if='farmStore.nowFarm' v-model="farmStore.nowFarm.name" label="Назва ферми" ></v-text-field>

               <v-autocomplete
                  v-model='addressModelUpdateFarm'
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
            </v-form>
         </v-card-text>
         <app-map />
         <v-card-actions>
            <v-btn type="submit" color="primary" @click = "updateFarm()" class="custom-btn w-100">Зберегти</v-btn>
         </v-card-actions>

      </v-card>
   </v-bottom-sheet>

</template>

<script lang='ts' setup>

import {Ref, ref} from 'vue'
import debounce from "lodash.debounce"
import AppMap from './AppMap.vue'
import type { AddressItem } from '@/services/map'
import { mapService } from '@/services/map'
import type {changeFarm, createFarms} from '@/models'
import {requestService} from '@/services'
import {useFarmStore} from '@/stores/farm-store.ts'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/stores'
import router from '@/router'
import {UserName} from '@/models'

const userStore = useUserStore()
const {populate} = userStore
populate()
const { currentUser } = storeToRefs(userStore)
const farmStore = useFarmStore()
const {populateFarms} = farmStore


const deleteFarmSheet = ref(false)
const updateFarmSheet = ref(false)

populateFarms()

function getMyFarm (){
   return farmStore.farms?.items.filter(farm => farm.user.id === currentUser.value?.id)
}

const emit = defineEmits<{
   (e: 'select', address: AddressItem): void
}>()

const request = requestService()


const addFarm = async () => {
   const spliteedAdress = addressModel.value?addressModel.value?.address.split(","):'error'
   const city = spliteedAdress[2]
   const body:createFarms = {

      name: name.value ? name.value.name : null,
      city: city,
      address: spliteedAdress[0]+","+ spliteedAdress[1]+","+ spliteedAdress[2],
      latitude: 122.21,
      longitude: 122.21
   }

   await request.createFarms(body)
   await populateFarms()
   sheet.value=false

}

function openUpdateFarm() {
   name.value = farmStore.nowFarm.name;
   const splittedAddress = farmStore.nowFarm.address.split(',');
   console.log(splittedAddress[2])
   addressModelUpdateFarm.value = {
      address: splittedAddress[0] + "," + splittedAddress[1],
      city: splittedAddress[2],
   };
}


const updateFarm = async () => {
   const address = addressModelUpdateFarm.value?.address;
   let city = '';
   if (address) {
      const parts = address.split(',');
      if (parts.length > 2) {
         city = parts[2]?.trim();
      } else {
         city = farmStore.nowFarm.city
      }
   }
   const body: changeFarm = {
      name: farmStore.nowFarm.name,
      city: city,
      address: address,
      latitude: 122.21,
      longitude: 122.21,
   };
   try {
      const res = await request.changeFarm(farmStore.nowFarm.id, body);
      console.log(res);
      await populateFarms()
      getMyFarm()
      updateFarmSheet.value = false;
   } catch (e) {
      console.log(e);
   }
}


const deleteFarm = async () => {
  try {
     const res = await request.deleteFarm(farmStore.nowFarmId)
     await populateFarms()
     getMyFarm()
     deleteFarmSheet.value = false
  } catch (e) {
     console.log(e)
  }
}

const sheet = ref(false)
const map = mapService()
const storedName = localStorage.getItem('name');
const name: Ref<UserName | null> = ref(storedName ? { name: storedName } : null);
const surname = ref(localStorage.getItem('surname') || '')
const phoneNumber = ref(localStorage.getItem('phoneNumber') || '')
const email = ref(localStorage.getItem('email') || '')
const editing = ref(false)


const editFarm = (farm: any) => {
   farmStore.nowFarm = farm;
   updateFarmSheet.value = true;
   openUpdateFarm();
}
const saveData = () => {
   localStorage.setItem('name', name.value)
   localStorage.setItem('surname', surname.value)
   localStorage.setItem('phoneNumber', phoneNumber.value)
   localStorage.setItem('email', email.value)
   localStorage.setItem('adress', addressModel?.value?.address ? addressModel?.value?.address: "Error")
   console.log('Data saved:', name.value, surname.value, phoneNumber.value, email.value)
   editing.value = false
}





const loading = ref<boolean>(false)
const addressModel = ref<AddressItem | null>(null)
const searchModel = ref<string | undefined>(undefined)
const items = ref<AddressItem[] | undefined>([])

//UpdateFarm
const addressModelUpdateFarm = ref<AddressItem | null>()




//
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

const getOrdersByFarmId = (farm: object) => {
   farmStore.nowFarm = farm
   router.replace(`/posts`)
   console.log(farm)
}

</script>

<style lang='scss' scoped>
.v-bottom-sheet-overlay {
   display: none;
}
.title-farm#address{
   color: #6168DB;
}

.ramka{
   width: 100%;
   padding: 10px;
   border-radius: 15px;

}
.action-button-add-farm {
   position: fixed;
   bottom: 20px;
   z-index: 10;
   left: 90%;
   transform: translateX(-50%);
}
</style>
