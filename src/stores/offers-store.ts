import {defineStore} from 'pinia'
import {changeOffer} from '@/models'
interface State {
   offers: changeOffer[]
}
export const useOffersStore = defineStore({
   id: 'offers',
   state: (): State => ({
      offers: []
   })


})
