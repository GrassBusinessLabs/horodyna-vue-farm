import {defineStore} from 'pinia'
import type {Ref} from 'vue'
import {ref} from 'vue'

import type {farmResponce} from '@/models'
import {requestService} from '@/services'
import {useHandleError} from '@/composables'

export const useFarmStore = defineStore('farm', () => {

   const {handleError} = useHandleError()


   const request = requestService()


   const farms: Ref<farmResponce | null> = ref<farmResponce | null>(null)

   function setFarms(value: farmResponce | null): void {
      farms.value = value
   }

   async function getFarmsData(): Promise<farmResponce | null> {
      try {


         const farmsData: farmResponce = await request.getFarms()
         setFarms(farmsData)

         return farms.value
      } catch (e) {
         console.error(e)
         handleError(e)
         return null
      }
   }

   async function populateFarms(): Promise<void> {
      try {




        await getFarmsData()

      } catch (e) {
         console.error(e)
         handleError(e)
      }
   }



   return {
      farms,
      setFarms,
      populateFarms,


   }
})
// import { defineStore } from 'pinia'
// import type { Ref } from 'vue'
// import { ref } from 'vue'
//
// import type { farmResponce } from '@/models'
//
// import { useHandleError } from '@/composables'
//
// export const useFarmStore = defineStore('farm', () => {
//    const { handleError } = useHandleError()
//
//
//
//
//    // Получение данных из localStorage при инициализации, если они там есть
//    const savedFarms = localStorage.getItem('farms')
//    const farms: Ref<farmResponce | null> = ref<farmResponce | null>(
//       savedFarms ? JSON.parse(savedFarms) : null
//    )
//
//    function setFarms(value: farmResponce | null): void {
//       farms.value = value
//       // Сохранение данных в localStorage при обновлении
//       localStorage.setItem('farms', JSON.stringify(value))
//    }
//
//
//
//    async function populateFarms(): Promise<void> {
//       try {
//
//       } catch (e) {
//          console.error(e)
//          handleError(e)
//       }
//    }
//
//    return {
//       farms,
//       setFarms,
//       populateFarms,
//    }
// })
