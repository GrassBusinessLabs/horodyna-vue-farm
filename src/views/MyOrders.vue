<script setup lang='ts'>

import HomeLayout from '@/layouts/HomeLayout.vue'
import {requestService} from '@/services'
import {useOrderStore} from '@/stores/order-store.ts'
import {ref} from 'vue'

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
     console.log(res)
  } catch (e) {
     console.log(e)
  }
}


const infoByOrder = async (id: number) => {
   infoOrder.value = true
   await getOrderById(id)
}
const getOrderById = async (id: number) => {
   orderStore.offersInfo = []
  try {
     const res = await request.getOrderById(id)
     orderStore.nowOrder = res
     for (const i of res.order_items){
        await getOfferById(i.offer_id)
     }

  } catch (e) {
     console.log(e)
  }
}

const changeStatusOrder = async (statusOrder: string) => {
   try {
      const res = await request.changeStatusOrder(55, orderStore.nowOrder.id, {status: statusOrder})
      await getOrders()
      infoOrder.value = false
      console.log(res)
   } catch (e) {
      console.log(e)
   }
}

const statuses = [
   { title: 'Підтверджено', status: 'APPROVED'},
   { title: 'Доставляється', status: 'SHIPPING'},
   { title: 'Відхилено', status: 'DECLINED'},
]

const getAddress = async (id: number) => {
   orderStore.allAddress = []
   try {
      const res = await request.getAddressById(id)
      orderStore.allAddress.push(res)

   } catch (e) {
      console.log(e)
   }
}


const formatDate = (dateString: any) => {
   const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
   };

   const formattedDate = new Date(dateString).toLocaleString('ua-UA', options);
   return formattedDate;
};


</script>


<template>
<home-layout>
<v-row>
   <v-col >
      <span class='ma-4 pa-2 d-flex justify-center flex-column align-center' v-if='orderStore.orders.some(order => order.status !== "SUBMITTED") || orderStore.orders.some(order => order.status !== "SHIPPING") || orderStore.orders.some(order => order.status === "APPROVED") || orderStore.orders.some(order => order.status === "COMPLETED")'>
         <img width='40%' src='https://cdn-icons-png.flaticon.com/512/5102/5102639.png' >
         <p class='marker-title font-weight-bold mt-2'>Замовлень немає</p>
      </span>
      <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "SUBMITTED")'>Очікують підтвердження</span>
      <v-card class='order' v-for='i of orderStore.orders'>

         <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "SUBMITTED"'>
            <v-avatar class='w-25 h-25' image='https://cdn-icons-png.flaticon.com/512/1027/1027650.png'></v-avatar>


            <div class='ml-2'>
               <p><v-icon>mdi-currency-uah</v-icon> {{i.product_price}} грн</p>
               <p><v-icon>mdi-truck-delivery-outline</v-icon> {{i.shipping_price}} грн</p>
               <p>До сплати {{i.total_price}} грн</p>
               <p>{{formatDate( i.created_data)}}</p>
            </div>

         </div>

      </v-card>

      <div>
         <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "SHIPPING")'>Доставляються</span>

         <v-card class='order' v-for='i of orderStore.orders' >

            <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "SHIPPING"'>
               <v-avatar class='w-25 h-25' image='https://cdn-icons-png.flaticon.com/512/1584/1584365.png'></v-avatar>


               <div class='ml-2'>
                  <p><v-icon>mdi-currency-uah</v-icon> {{i.product_price}} грн</p>
                  <p><v-icon>mdi-truck-delivery-outline</v-icon> {{i.shipping_price}} грн</p>
                  <p>До сплати {{i.total_price}} грн</p>
                  <p>{{formatDate( i.created_data)}}</p>
               </div>

            </div>

         </v-card>
      </div>

      <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "APPROVED")'>Підверджені</span>

      <v-card class='order' v-for='i of orderStore.orders' >

         <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "APPROVED"'>
            <v-avatar class='w-25 h-25' image='https://cdn-icons-png.flaticon.com/512/1584/1584360.png'></v-avatar>


            <div class='ml-2'>
               <p><v-icon>mdi-currency-uah</v-icon> {{i.product_price}} грн</p>
               <p><v-icon>mdi-truck-delivery-outline</v-icon> {{i.shipping_price}} грн</p>
               <p>Сплачено {{i.total_price}} грн</p>
               <p>{{formatDate( i.created_data)}}</p>
            </div>

         </div>
      </v-card>


      <span class='marker-title' v-if='orderStore.orders.some(order => order.status === "COMPLETED")'>Виконаний</span>

      <v-card class='order' v-for='i of orderStore.orders' >

         <div class='container' @click='infoByOrder(i.id)' v-if='i.status === "COMPLETED"'>
            <v-avatar class='w-25 h-25' image='https://cdn-icons-png.flaticon.com/512/1584/1584360.png'></v-avatar>


            <div class='ml-2'>
               <p><v-icon>mdi-currency-uah</v-icon> {{i.product_price}} грн</p>
               <p><v-icon>mdi-truck-delivery-outline</v-icon> {{i.shipping_price}} грн</p>
               <p>Сплачено {{i.total_price}} грн</p>
               <p>{{formatDate( i.created_data)}}</p>
            </div>

         </div>
      </v-card>
   </v-col>
</v-row>

   <v-bottom-sheet v-model='infoOrder'>
      <v-card height='700' class='bottom-card' >
         <v-card-title class='text-center'>
            Деталі замовлення #{{ orderStore.nowOrder.id }}
            <v-list-item-subtitle class='my-subtitle py-1'>
               Продукти: {{ orderStore.nowOrder.product_price }} грн
            </v-list-item-subtitle>
            <v-list-item-subtitle class='my-subtitle pt-2 pb-1'>
               Доставка: {{  orderStore.nowOrder.shipping_price}} грн
            </v-list-item-subtitle>
            Сума: {{  orderStore.nowOrder.total_price }} грн
         </v-card-title>
         <v-card-text>
            <div>

               <div  class='info-user'>
<!--                  <p class='username'>{{i.user.name}}</p>-->
                  <p>{{orderStore.nowOrder.address}}</p>
               </div>



               <div v-for='j of orderStore.offersInfo' class='d-flex justify-space-between offer'>
                  <div>
                     <v-avatar size='80' :image='imgURL+j.image'>

                     </v-avatar>
                  </div>


                  <div class='w-100 d-flex justify-center'>
                     <div>
                        <h3 class='title-order'>{{j.title}}</h3>
                        <p>{{j.description}}</p>
                        <div v-for='i of orderStore.nowOrder.order_items'>
                           <p v-if='i.offer_id === j.id'>{{i.amount}}{{j.unit}} x {{i.price}}грн</p>
                        </div>
                     </div>


                  </div>

               </div>

            </div>
         </v-card-text>

         <v-card-actions>
<!--            <div class='w-100'>-->
<!--               <v-btn class='change-status' :block='true'>Змінити статус замовлення</v-btn>-->
<!--            </div>-->
            <v-menu>
               <template v-slot:activator="{ props }">
                  <v-btn
                     class='w-100 change-status'
                     v-bind="props"
                  >
                     Змінити статус замовлення
                  </v-btn>
               </template>
               <v-list>
                  <v-list-item
                     @click='changeStatusOrder(item.status)'
                     v-for="(item, index) in statuses"
                     :key="index"
                     :value="index"
                  >
                     <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
               </v-list>
            </v-menu>
         </v-card-actions>

      </v-card>
   </v-bottom-sheet>
</home-layout>
</template>

<style scoped lang='scss'>
.order{
   border-radius: 30px;
   margin: 10px;
}

.container{
   display: flex;
   margin: 10px;
   justify-content: space-around;
   align-items: center;
   padding: 10px;
}

.image{
   height: 512px;
   width: 512px;
}
.offer{
   background: #eeeeee;
   border-radius: 20px;
   margin: 10px;
   padding: 10px;
}
.title-order{
   color: #6168DB;
}
.info-user{
   border-radius: 20px;
   margin: 10px;
   padding: 10px;
}
.username{
   color: #6168DB;
}
.marker-title{
   color: #6168DB;

}
.change-status{
   background: #6168DB;
   color: #fff;
}
</style>