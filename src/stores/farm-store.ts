import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';

import type { farmResponce } from '@/models';
import { requestService } from '@/services';
import { useHandleError } from '@/composables';

export const useFarmStore = defineStore('farm', () => {
   const { handleError } = useHandleError();
   const request = requestService()



   const storedFarms = localStorage.getItem('farms');
   const initialFarms = storedFarms ? JSON.parse(storedFarms) : null;
   const farms: Ref<farmResponce | null> = ref<farmResponce | null>(initialFarms);
   const nowFarm: Ref<farmResponce | null> = ref<farmResponce | null>(null);
   const farmsId = ref([])
   const farmsAddress = ref([])
   function setFarms(value: farmResponce | null): void {
      farms.value = value;
      // Update localStorage whenever farms are changed
      localStorage.setItem('farms', JSON.stringify(value));
   }

   async function getFarmsData(): Promise<farmResponce | null> {
      try {
         const farmsData: farmResponce = await request.getFarms();
         setFarms(farmsData);
         return farms.value;
      } catch (e) {
         console.error(e);
         handleError(e);
         return null;
      }
   }

   async function populateFarms(): Promise<void> {
      try {
         await getFarmsData();
      } catch (e) {
         console.error(e);
         handleError(e);
      }
   }

   return {
      farms,
      setFarms,
      nowFarm,
      populateFarms,
      farmsId,
      farmsAddress
   };
});
