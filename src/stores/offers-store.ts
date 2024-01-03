import {defineStore} from 'pinia'
interface State {
   offers: any[]
}
export const useOffersStore = defineStore({
   id: 'offers',
   state: (): State => ({
      offers: []
   })


})
