<script setup lang='ts'>

import HomeLayout from '@/layouts/HomeLayout.vue'
import {requestService} from '@/services'
import {useOrderStore} from '@/stores/order-store.ts'
import {log} from 'util'
import {onMounted, ref} from 'vue'
import percent = CSS.percent

const request = requestService()
const orderStore = useOrderStore()
const transactionInfoSheet = ref(false)
const imgURL = 'https://horodyna.grassbusinesslabs.tk/static/'
const goToPay = () => {
   window.location.href = 'https://www.liqpay.ua/api/3/checkout?data=eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOiI1IiwiY3VycmVuY3kiOiJVQUgiLCJkZXNjcmlwdGlvbiI6ItCc0ZbQuSDRgtC+0LLQsNGAIiwicHVibGljX2tleSI6InNhbmRib3hfaTgzNDQzMTE5MDA2IiwibGFuZ3VhZ2UiOiJ1ayJ9&signature=SQrNRqDnq8so8fa5oYjVhtoUvoo='
}

const getPercentage = async () => {
   try {
      const res = await request.getPercentage()
      orderStore.orders_percentage = res
      console.log(orderStore.orders_percentage)
   } catch (e) {
      console.log(e)
   }
}

const getOrderById = async (id: number) => {
   try {
      const res = await request.getOrderById(id)
      orderStore.nowOrder = res
      console.log(res)
   } catch (e) {
      console.log(e)
   }
}

const getNowOfferById = async (id: number) => {
   try {
      const res = await request.getOfferById(id)
      orderStore.infoOffersNowOrder.push(res)

   } catch (e) {
      console.log(e)
   }
}

const getNowInfoOrdersById = async (id: number) => {
   try {
      const res = await request.getOrderById(id)
      orderStore.nowOrder = res
      for (const i of res.order_items) {
         await getNowOfferById(i.offer_id)
      }

   } catch (e) {
      console.log(e)
   }
}

onMounted(async () => {
   await getPercentage()
})

const infoTransaction = async (orderId: number, percent: number) => {
   orderStore.infoOffersNowOrder = []
   orderStore.nowPercent = percent
   await getOrderById(orderId)
   await getNowInfoOrdersById(orderId)
   transactionInfoSheet.value = true
}
const formatDate = (dateString: any) => {
   const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
   }

   const formattedDate = new Date(dateString).toLocaleString('ua-UA', options)
   return formattedDate
}

</script>

<template>
   <home-layout>
      <v-col>
         <v-card class='transactions_order' v-if='orderStore.orders_percentage.total > 0' @click='infoTransaction(trans.id, trans.percentage)'
                 v-for='trans of orderStore.orders_percentage.items'>
            <div class='container'>
               <div class='d-flex justify-space-between'>
                  <div class='d-flex flex-column'>
                     <p class='title-order'>{{ trans.user.name }}</p>
                     <p>{{ formatDate(trans.created_data) }}</p>

                  </div>

               </div>

               <div>
                     <span class='title-order'>
                     <p>{{ trans.percentage }} <v-icon>mdi-currency-uah</v-icon></p>
                     </span>
               </div>


            </div>
         </v-card>

         <span class='ma-4 pa-2 d-flex justify-center flex-column align-center' v-else>
            <img width='60%'
                 src='https://assets.materialup.com/uploads/bcf6dd06-7117-424f-9a6e-4bb795c8fb4d/preview.png'>
            <p class='marker-title font-weight-bold mt-2'>Транзакцій до сплати немає</p>
         </span>


      </v-col>
      <v-btn v-if='orderStore.orders_percentage.total > 0' class='btn-pay' @click='goToPay()'>До сплати
         {{ orderStore.orders_percentage.total }}
         <v-icon>mdi-currency-uah</v-icon>
      </v-btn>

      <v-bottom-sheet v-model='transactionInfoSheet'>
         <v-card>
            <v-card-title class='text-center '>
               Деталі замовлення
            </v-card-title>
            <v-card-subtitle class='text-center '>
               Дата замовлення: {{ formatDate(orderStore.nowOrder.created_data) }}
            </v-card-subtitle>
            <v-card-title class='text-center '>
               Відсоток за транзакцію: {{orderStore.nowPercent}} грн
            </v-card-title>
            <v-card-text>
               <div class='info-user'>
                  <div class='blank-address'>


                     <p class='title-order' v-if='orderStore.nowOrder.post_office'>
                        <v-avatar size='25' rounded
                                  image='https://play-lh.googleusercontent.com/mtyOm0Rp0PeG_BWE7M5j9gBWuU1Du34LLj-dLdSE1-006_BkFg32W3Cca00l2BBvNM0'></v-avatar>
                        <b class='ml-2'>{{ orderStore.nowOrder.post_office }}</b></p>
                     <p class='title-order mt-2' v-if='orderStore.nowOrder.user'><b>{{ orderStore.nowOrder.user.name }}</b></p>
                     <p class='title-order'><b>+380 96 00 0000</b></p>
                     <p class='title-order' v-if='orderStore.nowOrder.ttn !== null'> ТТН <b>2045 2784 9475 2456</b></p>
                  </div>
               </div>

                  <div v-for='j of orderStore.infoOffersNowOrder'
                    class='d-flex w-100 justify-space-between align-center offer'>



                  <div class='d-flex'>

                     <div class='w-100 ml-4 d-flex'>

                        <div class='w-100 ml-2 d-flex justify-center align-center'>
                           <div>
                              <v-avatar size='80' :image='imgURL+j.image'>

                              </v-avatar>
                           </div>
                           <div class='ml-2'>
                              <h3 class='title-order'>{{ j.title }}</h3>
                              <p>{{ j.description }}</p>
                              <div  v-for='i of orderStore.nowOrder.order_items'>
                                 <p class='title-order' v-if='i.offer_id === j.id'>{{ i.amount }}{{ j.unit }} x
                                    {{ i.price }}<v-icon size='16'>mdi-currency-uah</v-icon></p>
                              </div>
                           </div>

                        </div>


                     </div>
                  </div>

                  <div>
                     <div class='pl-4 d-flex align-center justify-center' v-for='i of orderStore.nowOrder.order_items'>
                        <p class='title-order' v-if='i.offer_id === j.id'>{{ i.amount * i.price }}</p>
                        <p class='title-order' ><v-icon size='18' v-if='i.offer_id === j.id'>mdi-currency-uah</v-icon></p>
                     </div>
                  </div>


               </div>
               <h3 class='text-center mb-3'>Сума: {{ orderStore.nowOrder.total_price }} грн</h3>

            </v-card-text>
         </v-card>
      </v-bottom-sheet>

   </home-layout>


</template>

<style scoped lang='scss'>
.transactions_order {
   border-radius: 15px;
   padding: 10px;
   margin: 10px 0;
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

.marker-title {
   color: #6168DB;
}

.container {
   display: flex;
   align-items: center;
   justify-content: space-between;
}

.price-transaction {
   font-size: 16px;
   color: green;
   font-weight: 700;
}
.offer {
   background: #eeeeee;
   border-radius: 20px;
   margin: 10px 0;
   padding: 10px;
}
.title-order {
   color: #6168DB;
}
.info-user {
   border-radius: 20px;
   margin-bottom: 10px;
   padding-bottom: 10px;
   width: 100%;
   position: relative;
}
.blank-address{
   background: #eeeeee;
   border-radius: 20px;

   padding: 20px;
}
.logo-nova-post{
   position: absolute;
   right: 0;
   top: 0;
   margin: 10px;
}
</style>