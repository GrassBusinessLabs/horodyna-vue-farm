<script setup lang='ts'>

import HomeLayout from '@/layouts/HomeLayout.vue'
import {requestService} from '@/services'
import {useOrderStore} from '@/stores/order-store.ts'
import {computed, onMounted, ref} from 'vue'

const imgURL = 'https://horodyna.grassbusinesslabs.tk/static/'
const infoOrder = ref(false)
const orderStore = useOrderStore()
const request = requestService()
const getOrders = async () => {
   try {
      const res = await request.getOrdersByFarmer()
      orderStore.orders = res.items
   } catch (e) {
      console.log(e)
   }
}
getOrders()

const getOfferById = async (id: number) => {

   try {
      const res = await request.getOfferById(id)
      orderStore.offersInfo.push(res)


      return res.image
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


const infoByOrder = async (id: number) => {
   orderStore.infoOffersNowOrder = []
   infoOrder.value = true
   await getNowInfoOrdersById(id)
}

const getNowInfoOrdersById = async (id: number) => {
   try {
      const res = await request.getOrderById(id)
      orderStore.nowOrder = res

   } catch (e) {
      console.log(e)
   }
}
const getOrderById = async (id: number) => {
   orderStore.offersInfo = []
   try {
      const res = await request.getOrderById(id)
      orderStore.nowOrder = res
      for (const i of res.order_items) {
         await getOfferById(i.offer_id)
      }

   } catch (e) {
      console.log(e)
   }
}


const changeStatusOrder = async (statusOrder: string) => {
   try {
      const res = await request.changeStatusOrder(orderStore.infoOffersNowOrder[0].farm_id, orderStore.nowOrder.id, {status: statusOrder})
      await getOrders()
      infoOrder.value = false
      console.log(res)
   } catch (e) {
      console.log(e)
   }
}

const getMonthName = (monthIndex: number) => {
   const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
   return months[monthIndex];
};

const formatDate = (dateString: any) => {
   const date = new Date(dateString);
   const day = date.getDate();
   const monthIndex = date.getMonth();
   const year = date.getFullYear();

   const monthName = getMonthName(monthIndex);

   return `${day} ${monthName} ${year}`;
};


const statusToString = computed(() => (status: string) => {
   if (status === 'APPROVED') {
      return 'Підтверджено'
   }
   if (status === 'DECLINED') {
      return 'Відхилено'
   }
   if (status === 'SHIPPING') {
      return 'Доставляється'
   }
   if (status === 'COMPLETED') {
      return 'Виконано'
   }
   if (status === 'SUBMITTED') {
      return 'Очікує підвердження'
   }
})



</script>


<template>
   <home-layout>

      <v-row>
         <v-col>
            <div>
          <span class='ma-4 pa-2 d-flex justify-center flex-column align-center'
                v-if='orderStore.orders.length < 1 || orderStore.orders.every(order => order.status === "DRAFT")'>
         <img width='40%' src='https://cdn-icons-png.flaticon.com/512/5102/5102639.png'>
         <p class='marker-title font-weight-bold mt-2'>Замовлень немає</p>
      </span>
            </div>


            <div class='order-block' v-if='orderStore.orders.some(order => order.status === "SUBMITTED")'>
               <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "SUBMITTED")'>Очікують підтвердження <v-icon
                  size='15'>mdi-reload</v-icon></span>
               <div v-for='i of orderStore.orders'>
                  <v-card class='order' v-if='i.status === "SUBMITTED"'>

                     <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "SUBMITTED"'>

                        <div class='d-flex justify-space-between w-100 mb-2' >
                           <div class='d-flex overflow-x-auto w-50'>
                              <div class='d-flex' :style="{ position: 'relative', left: (index * -7) + '%', zIndex: index, opacity: 1 }" v-for='(j, index) of i.order_items'>
                                 <img class='icon-img-order' :src='imgURL + j.offer.image' height='60px' width='60px'>
                              </div>
                           </div>

                           <div class='d-flex flex-column justify-center align-end w-50'>
                              <p class='username user'>{{ i.user.name }}</p>
                              <p class='username phone_number'>{{ i.user.phone_number}}</p>

                           </div>

                        </div>
                        <div class='ml-2 mt-2 d-flex justify-space-between w-100 '>

                           <p class='total-sum-order'>
                              <v-icon>
                                 mdi-cash
                              </v-icon>
                              {{ i.total_price }} грн
                           </p>
                           <p class='date-order'>
                              {{ formatDate(i.created_data) }}
                           </p>
                        </div>
                     </div>

                  </v-card>
               </div>

            </div>


            <div class='order-block' v-if='orderStore.orders.some(order => order.status === "SHIPPING")'>
               <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "SHIPPING")'>Доставляються <v-icon
                  size='15' icon='mdi-truck'></v-icon></span>
               <div v-for='i of orderStore.orders'>
                  <v-card class='order' v-if='i.status === "SHIPPING"'>

                     <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "SHIPPING"'>

                        <div class='d-flex justify-space-between w-100 mb-2' >
                           <div class='d-flex overflow-x-auto w-50'>
                              <div class='d-flex' :style="{ position: 'relative', left: (index * -7) + '%', zIndex: index, opacity: 1 }" v-for='(j, index) of i.order_items'>
                                 <img class='icon-img-order' :src='imgURL + j.offer.image' height='60px' width='60px'>
                              </div>
                           </div>

                           <div class='d-flex flex-column justify-center align-end w-50'>
                              <p class='username user'>{{ i.user.name }}</p>
                              <p class='username phone_number'>{{ i.user.phone_number}}</p>

                           </div>

                        </div>
                        <div class='ml-2 mt-2 d-flex justify-space-between w-100 '>

                           <p class='total-sum-order'>
                              <v-icon>
                                 mdi-cash
                              </v-icon>
                              {{ i.total_price }} грн
                           </p>
                           <p class='date-order'>
                              {{ formatDate(i.created_data) }}
                           </p>
                        </div>

                     </div>

                  </v-card>
               </div>

            </div>

            <div class='order-block' v-if='orderStore.orders.some(order => order.status === "APPROVED")'>
               <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "APPROVED")'>Підтверджені <v-icon
                  size='15'>mdi-tag-check</v-icon></span>

               <div v-for='i of orderStore.orders'>
                  <v-card class='order' v-if='i.status === "APPROVED"'>

                     <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "APPROVED"'>
                        <div class='d-flex justify-space-between w-100 mb-2' >
                           <div class='d-flex overflow-x-auto w-50'>
                              <div class='d-flex' :style="{ position: 'relative', left: (index * -7) + '%', zIndex: index, opacity: 1 }" v-for='(j, index) of i.order_items'>
                                 <img class='icon-img-order' :src='imgURL + j.offer.image' height='60px' width='60px'>
                              </div>
                           </div>

                           <div class='d-flex flex-column justify-center align-end w-50'>
                              <p class='username user'>{{ i.user.name }}</p>
                              <p class='username phone_number'>{{ i.user.phone_number}}</p>

                           </div>

                        </div>
                        <div class='ml-2 mt-2 d-flex justify-space-between w-100 '>

                           <p class='total-sum-order'>
                              <v-icon>
                                 mdi-cash
                              </v-icon>
                              {{ i.total_price }} грн
                           </p>
                           <p class='date-order'>
                              {{ formatDate(i.created_data) }}
                           </p>
                        </div>

                     </div>
                  </v-card>
               </div>

            </div>

            <div class='order-block' v-if='orderStore.orders.some(order => order.status === "DECLINED")'>

               <span class='marker-title'
                     v-if='orderStore.orders.some(order => order.status === "DECLINED")'>Відхилені <v-icon size='15'>mdi-close-circle</v-icon></span>
               <div v-for='i of orderStore.orders'>
                  <v-card class='order blur-content' v-if='i.status === "DECLINED"'>

                     <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "DECLINED"'>

                        <div class='d-flex justify-space-between w-100 mb-2' >
                           <div class='d-flex overflow-x-auto w-50'>
                              <div class='d-flex' :style="{ position: 'relative', left: (index * -7) + '%', zIndex: index, opacity: 1 }" v-for='(j, index) of i.order_items'>
                                 <img class='icon-img-order' :src='imgURL + j.offer.image' height='60px' width='60px'>
                              </div>
                           </div>

                           <div class='d-flex flex-column justify-center align-end w-50'>
                              <p class='username user'>{{ i.user.name }}</p>
                              <p class='username phone_number'>{{ i.user.phone_number}}</p>

                           </div>

                        </div>
                        <div class='ml-2 mt-2 d-flex justify-space-between w-100 '>

                           <p class='total-sum-order'>
                              <v-icon>
                                 mdi-cash
                              </v-icon>
                              {{ i.total_price }} грн
                           </p>
                           <p class='date-order'>
                              {{ formatDate(i.created_data) }}
                           </p>
                        </div>
                     </div>
                  </v-card>
               </div>

            </div>

            <div class='order-block ' v-if='orderStore.orders.some(order => order.status === "COMPLETED")' >

               <span class='marker-title'
                     v-if='orderStore.orders.some(order => order.status === "COMPLETED")'>Виконані <v-icon size='15'>mdi-check-circle</v-icon></span>

               <div v-for='i of orderStore.orders'>
                  <v-card class='order blur-content' v-if='i.status === "COMPLETED"'>

                     <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "COMPLETED"'>
                        <div class='d-flex justify-space-between w-100 mb-2' >
                           <div class='d-flex overflow-x-auto w-50'>
                              <div class='d-flex' :style="{ position: 'relative', left: (index * -7) + '%', zIndex: index, opacity: 1 }" v-for='(j, index) of i.order_items'>
                                 <img class='icon-img-order' :src='imgURL + j.offer.image' height='60px' width='60px'>
                              </div>
                           </div>

                           <div class='d-flex flex-column justify-center align-end w-50'>
                              <p class='username user'>{{ i.user.name }}</p>
                              <p class='username phone_number'>{{ i.user.phone_number}}</p>

                           </div>

                        </div>
                        <div class='ml-2 mt-2 d-flex justify-space-between w-100 '>

                           <p class='total-sum-order'>
                              <v-icon>
                                 mdi-cash
                              </v-icon>
                              {{ i.total_price }} грн
                           </p>
                           <p class='date-order'>
                              {{ formatDate(i.created_data) }}
                           </p>
                        </div>

                     </div>
                  </v-card>
               </div>

            </div>


         </v-col>
      </v-row>

      <v-bottom-sheet v-model='infoOrder'>
         <v-card height='700' class='bottom-card'>
            <v-card-title class='text-center'>

               <v-list-item-title class='my-subtitle pt-2 pb-1'>
                  {{ statusToString(orderStore.nowOrder.status) }}
               </v-list-item-title>
            </v-card-title>
            <v-card-text>
               <div class='w-100'>
                  <div class='info-user'>
                     <div class='blank-address'>


                        <p class='username' v-if='orderStore.nowOrder.post_office'>
                           <v-avatar size='25' rounded
                                     image='https://play-lh.googleusercontent.com/mtyOm0Rp0PeG_BWE7M5j9gBWuU1Du34LLj-dLdSE1-006_BkFg32W3Cca00l2BBvNM0'></v-avatar>
                           <b class='ml-2' v-if='orderStore.nowOrder.post_office_city'>{{ orderStore.nowOrder.post_office_city }}, </b>
                           <b>{{ orderStore.nowOrder.post_office }}</b></p>
                        <p class='username mt-2' v-if='orderStore.nowOrder.user'><b>{{ orderStore.nowOrder.user.name
                           }}</b></p>
                        <p class='username' v-if='orderStore.nowOrder.user'>
                           <b>{{ orderStore.nowOrder.user.phone_number }}</b></p>
                        <p class='username' v-if='orderStore.nowOrder.ttn !== null'> ТТН <b>2045 2784 9475 2456</b></p>
                     </div>

                  </div>


                  <div class='d-flex w-100 justify-space-between align-center offer' v-for='j of orderStore.nowOrder.order_items'>
                     <div class='d-flex align-center'>
                        <div>
                           <div >
                              <v-avatar size='80' :image='imgURL+j.offer.image'>
                              </v-avatar>
                           </div>

                        </div>


                        <div class='w-100 ml-4 d-flex justify-start'>
                           <div class='w-100'>
                              <h3 class='title-order'>{{ j.offer.title }}</h3>
                              <p>{{ j.offer.description }}</p>
                              <div >
                                 <p class='title-order' >{{ j.amount }}{{ j.offer.unit }} x
                                    {{ j.offer.price }}
                                    <v-icon size='16'>mdi-currency-uah</v-icon>
                                 </p>
                              </div>
                           </div>


                        </div>
                     </div>

                     <div>
                        <div  class='pl-6 d-flex'>
                           <p class='title-order' >{{ j.amount * j.offer.price }}</p>
                           <p class='title-order' >
                              <v-icon size='16'>mdi-currency-uah</v-icon>
                           </p>
                        </div>
                     </div>


                  </div>

               </div>
            </v-card-text>
            <v-card-actions class='d-flex justify-center'>
               <h3 class='text-center title-order'>Сума: {{ orderStore.nowOrder.total_price }} грн</h3>
            </v-card-actions>

            <v-card-actions>
               <!--            <div class='w-100'>-->
               <!--               <v-btn class='change-status' :block='true'>Змінити статус замовлення</v-btn>-->
               <!--            </div>-->
               <div v-if='orderStore.nowOrder.status === "SUBMITTED"' class='w-100 d-flex justify-space-around'>
                  <v-btn @click='changeStatusOrder("DECLINED")' class='decline-btn'>Відхилити</v-btn>
                  <v-btn @click='changeStatusOrder("APPROVED")' class='approve-btn'>Підтвердити</v-btn>
               </div>

               <div v-if='orderStore.nowOrder.status === "APPROVED"' class='w-100 d-flex justify-space-around'>
                  <v-btn @click='changeStatusOrder("DECLINED")' class='decline-btn'>Відхилити</v-btn>
                  <v-btn @click='changeStatusOrder("SHIPPING")' class='approve-btn'>Відправити</v-btn>
               </div>
               <!--               <v-menu v-if='orderStore.nowOrder.status === "SUBMITTED"'>-->
               <!--                  <template v-slot:activator='{ props }'>-->
               <!--                     <v-btn-->
               <!--                        class='w-100 change-status'-->
               <!--                        v-bind='props'-->
               <!--                     >-->
               <!--                        Змінити статус замовлення-->
               <!--                     </v-btn>-->
               <!--                  </template>-->
               <!--                  <v-list>-->
               <!--                     <v-list-item-->

               <!--                        @click='changeStatusOrder(item.status)'-->
               <!--                        v-for='(item, index) in statusesApproveAndDecline'-->
               <!--                        :key='index'-->
               <!--                        :value='index'-->
               <!--                     >-->
               <!--                        <v-list-item-title>{{ item.title }}</v-list-item-title>-->
               <!--                     </v-list-item>-->
               <!--                  </v-list>-->
               <!--               </v-menu>-->

               <!--               <v-menu v-if='orderStore.nowOrder.status === "APPROVED"'>-->
               <!--                  <template v-slot:activator='{ props }'>-->
               <!--                     <v-btn-->
               <!--                        class='w-100 change-status'-->
               <!--                        v-bind='props'-->
               <!--                     >-->
               <!--                        Змінити статус замовлення-->
               <!--                     </v-btn>-->
               <!--                  </template>-->
               <!--                  <v-list>-->
               <!--                     <v-list-item-->

               <!--                        @click='changeStatusOrder(item.status)'-->
               <!--                        v-for='(item, index) in statusesShipping'-->
               <!--                        :key='index'-->
               <!--                        :value='index'-->
               <!--                     >-->
               <!--                        <v-list-item-title>{{ item.title }}</v-list-item-title>-->
               <!--                     </v-list-item>-->
               <!--                  </v-list>-->
               <!--               </v-menu>-->

               <!--               <v-menu v-if='orderStore.nowOrder.status === "SHIPPING"'>-->
               <!--                  <template v-slot:activator='{ props }'>-->
               <!--                     <v-btn-->
               <!--                        class='w-100 change-status'-->
               <!--                        v-bind='props'-->
               <!--                     >-->
               <!--                        Змінити статус замовлення-->
               <!--                     </v-btn>-->
               <!--                  </template>-->
               <!--                  <v-list>-->
               <!--                     <v-list-item-->

               <!--                        @click='changeStatusOrder(item.status)'-->
               <!--                        v-for='(item, index) in statusesForShipping'-->
               <!--                        :key='index'-->
               <!--                        :value='index'-->
               <!--                     >-->
               <!--                        <v-list-item-title>{{ item.title }}</v-list-item-title>-->
               <!--                     </v-list-item>-->
               <!--                  </v-list>-->
               <!--               </v-menu>-->
            </v-card-actions>

         </v-card>
      </v-bottom-sheet>
   </home-layout>
</template>

<style scoped lang='scss'>
.order {
   border-radius: 30px;
   margin: 15px 0;
   padding: 5px 0;
}

.container {
   display: flex;
   margin: 10px 10px 0 10px;
   flex-direction: column;
   justify-content: space-around;
   align-items: center;
   padding: 10px;
}

.image {
   height: 512px;
   width: 512px;
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

.username {
   color: #6168DB;
}

.marker-title {
   color: #6168DB;
}

.change-status {
   background: #6168DB;
   color: #fff;
}

.counter_offers {
   top: 0;
   right: 0;
   display: flex;
   justify-content: center;
   align-items: center;
   position: absolute;
   border-radius: 50%;
   background: #6168DB;
   width: 22px;
   height: 22px;
   color: #fff;
   font-weight: 700;

}

.order-block {
   margin: 10px;
}

.icon-img-order {
   border-radius: 15px;
   //padding: 5px;
   object-fit: cover;
   box-shadow: 0px 0px 15px 0px rgba(176,176,176, 1);
   background: #fff;
}


.approve-btn {
   background: #6168DB;
   color: #fff;
   width: 50%;
   padding: 5px 20px;
}

.decline-btn {
   background: #fff;
   color: #6168DB;
   outline: 1px solid #6168DB;
   width: 50%;
   padding: 5px 20px;
}

.blank-address {
   background: #eeeeee;
   border-radius: 20px;

   padding: 20px;
}

.logo-nova-post {
   position: absolute;
   right: 0;
   top: 0;
   margin: 10px;
}


.blur-content {
   filter: grayscale(70%);
   opacity: 0.7;
}

.blur {
   filter: grayscale(70%);

}
.date-order{
   color: grey;
   font-weight: 500;
   font-size: 14px;

}
.total-sum-order{
   color: grey;
   font-weight: 700;

}

.user{
   font-weight: 800;

}
.phone_number{
   font-weight: 500;
}
</style>