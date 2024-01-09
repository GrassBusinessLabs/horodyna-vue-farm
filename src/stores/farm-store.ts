import {defineStore} from 'pinia'
import type {Ref} from 'vue'
import {ref} from 'vue'

import type {farmResponce} from '@/models'
import {authTokenService, requestService} from '@/services'
import {useHandleError, useRouting} from '@/composables'

export const useFarmStore = defineStore('farm', () => {
   const {handleError} = useHandleError()
   const routing = useRouting()

   const request = requestService()
   const authToken = authTokenService()

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
         const token: string | null = await authToken.get()



         const userData: farmResponce | null = await getFarmsData()

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
