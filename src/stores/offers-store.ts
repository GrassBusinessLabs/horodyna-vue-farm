import {defineStore} from 'pinia'
import {changeOffer} from '@/models'
interface State {
   offers: changeOffer[],
   nowOffer: changeOffer[],
   croppedImage: any
}
export const useOffersStore = defineStore({id: 'offers',
   state: (): State => ({
      offers: [],
      nowOffer: [],
      croppedImage: null

   })


})
