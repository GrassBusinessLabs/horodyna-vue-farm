import {defineStore} from 'pinia'
import {changeOffer} from '@/models'
interface State {
   offers: changeOffer[],
   nowOffer: changeOffer[],
   croppedImage: any,
   nowImageBase64: string | null,
   nameImageNow: string | null,
   nowFarmOffers: any [] | null,
   croppedImageAdditional: any,
   dataAdditionalImage: any,
   nowAdditionalImage: object,
}
export const useOffersStore = defineStore({id: 'offers',
   state: (): State => ({
      offers: [],
      nowOffer: [],
      croppedImage: null,
      nowImageBase64: null,
      nameImageNow: null,
      nowFarmOffers: [],
      croppedImageAdditional: null,
      dataAdditionalImage: null,
      nowAdditionalImage: {},
   })


})
