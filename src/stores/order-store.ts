import {defineStore} from 'pinia'

interface State {
  orders: any [],
   nowOrder: any [],
   offersInfo: any [],
   allAddress: any [],
   ordersInfo: any [],
   orders_percentage: any[]
}
export const useOrderStore = defineStore({id: 'orders',
   state: (): State => ({
      orders: [],
      nowOrder: [],
      offersInfo: [],
      allAddress: [],
      ordersInfo: [],
      orders_percentage: []
   })


})
