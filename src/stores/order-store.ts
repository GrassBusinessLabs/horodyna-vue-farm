import {defineStore} from 'pinia'

interface State {
  orders: any [],
   nowOrder: any [],
   offersInfo: any [],
   allAddress: any [],
   ordersInfo: any [],
   orders_percentage: any[],
   infoOffersNowOrder: any [],
   nowPercent: number

}
export const useOrderStore = defineStore({id: 'orders',
   state: (): State => ({
      orders: [],
      nowOrder: [],
      offersInfo: [],
      allAddress: [],
      ordersInfo: [],
      orders_percentage: [],
      infoOffersNowOrder: [],
      nowPercent: 0
   })


})
