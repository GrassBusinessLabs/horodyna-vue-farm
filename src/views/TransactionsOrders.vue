<script setup lang='ts'>

import HomeLayout from '@/layouts/HomeLayout.vue'
import {requestService} from '@/services'
import {useOrderStore} from '@/stores/order-store.ts'

const request = requestService()
const orderStore = useOrderStore()
const goToPay = () => {
   window.location.href = 'https://www.liqpay.ua/api/3/checkout?data=eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOiI1IiwiY3VycmVuY3kiOiJVQUgiLCJkZXNjcmlwdGlvbiI6ItCc0ZbQuSDRgtC+0LLQsNGAIiwicHVibGljX2tleSI6InNhbmRib3hfaTgzNDQzMTE5MDA2IiwibGFuZ3VhZ2UiOiJ1ayJ9&signature=SQrNRqDnq8so8fa5oYjVhtoUvoo='
}

const getPercentage = async () => {
   try {
      const res = await request.getPercentage()
      orderStore.orders_percentage = res.orders_percentage
      console.log(orderStore.orders_percentage)
   } catch (e) {
      console.log(e)
   }
}

getPercentage()
</script>

<template>
   <home-layout>
      <v-col>
         <v-card class='transactions_order' v-if='orderStore.orders_percentage.length > 0'>
            <h1>Ордер</h1>
         </v-card>

         <span class='ma-4 pa-2 d-flex justify-center flex-column align-center' v-else>
            <img width='60%' src='https://assets.materialup.com/uploads/bcf6dd06-7117-424f-9a6e-4bb795c8fb4d/preview.png'>
            <p class='marker-title font-weight-bold mt-2'>Транзакцій до сплати немає</p>
         </span>

      </v-col>
      <v-btn v-if='orderStore.orders_percentage.length > 0' class='btn-pay' @click='goToPay()'>До сплати 350
         <v-icon>mdi-currency-uah</v-icon>
      </v-btn>

   </home-layout>


</template>

<style scoped lang='scss'>
.transactions_order {
   border-radius: 15px;
   padding: 10px;
}

.btn-pay {
   position: fixed;
   width: 90%;
   background: #6168DB;
   color: #fff;
   bottom: 0;
   left: 50%;
   transform: translate(-50%, -50%);
}
.marker-title{
   color: #6168DB;
}
</style>