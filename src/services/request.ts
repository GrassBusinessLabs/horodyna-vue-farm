import {apiService} from '@/services/api'
import type {
   AddPostBody,
   CurrentUser,
   LoginBody,
   Post,
   createOffer,
   changeOffer,
   RegisterBody,
   createFarms,
   farmResponce, ChangePassword, changeFarm
} from '@/models'

export const requestService = () => {
   const api = apiService()

   async function login(body: LoginBody): Promise<CurrentUser> {

      return api.post('/auth/login', body)
   }

   // async function getPosts(): Promise<GetPostsResponse> {
   //    return api.get('/posts')
   // }

   async function addPost(body: AddPostBody): Promise<Post> {
      // WARNING!!! This request only simulates adding a new post
      return api.post('/posts', body)
   }

   async function changePassword(body: ChangePassword): Promise<ChangePassword> {
      return api.post('/auth/change-pwd', body)
   }

   async function register(body: RegisterBody): Promise<CurrentUser> {
      return api.post('/auth/register', body)
   }

   async function getCurrentUser(): Promise<CurrentUser> {
      // WARNING!!! In real projects, this request will look something like this api.get('/users/me')
      return api.get('users')
   }

   async function logout(): Promise<void> {
      // WARNING!!! In real projects, this request will look something like this api.post('/logout')
      return api.post('/auth/logout')
   }
   async function getCategories() {
      return api.get('/categories')
   }
   async function createOffer(body: createOffer) {
      return api.post('/offers', body)
   }
   async function createFarms(body: createFarms) {
      return api.post('/farms', body)
   }
   async function getOffers() {
      return api.get('/offers')
   }
   async function getOffersByFarmId(id: number) {
      return api.get(`/offers/by-farmid/${id}`)
   }
   async function getFarmById(id: number) {
      return api.get(`/farms/${id}`)
   }
   async function getFarms():Promise<farmResponce> {
      return api.get('/farms')
   }
   async function getOfferById(id: any) {
      return api.get(`/offers/${id}`)
   }
   async  function changeOffer(body: changeOffer){
      return api.put(`/offers/${body.id}`, body)
   }
   async function deleteOffer(id: any){
      return api.del(`/offers/${id}`)
   }
   async function getOrdersByFarmer(){
      return api.get(`/orders/by-farmer`)
   }

   async function getAddressById(id: number) {
      return api.get(`/address/${id}`)
   }

   async function getOrderById(id: number) {
      return api.get(`/orders/${id}`)
   }
   async function addAdditionalImage(id: number, body: any) {
      return api.post(`/offers/additional-image/${id}`, body)
   }
   async function deleteAdditionalImage(idOffer: number, idImage: number) {
      return api.del(`/offers/additional-image/${idOffer}/${idImage}`)
   }
   async function deleteFarm(farmId: number) {
      return api.del(`/farms/${farmId}`)
   }
   async function changeFarm(farmId: number, body: changeFarm) {
      return api.put(`/farms/${farmId}`, body)
   }
   async function changeStatusOrder(farmID: number, orderID: number, body: {status: string}) {
      return api.put(`/orders/farmer-status/${farmID}/${orderID}`, body)
   }
   async function getPercentage () {
      return api.get(`orders/farmer-percentage`)
   }
   return {
      getPercentage,
      changeStatusOrder,
      changeFarm,
      deleteFarm,
      deleteAdditionalImage,
      addAdditionalImage,
      getAddressById,
      getOrderById,
      getOrdersByFarmer,
      getOffersByFarmId,
      changePassword,
      login,
      register,
      createOffer,
      getCategories,
      getFarmById,
      getCurrentUser,
      logout,
      addPost,
      getOffers,
      changeOffer,
      getOfferById,
      deleteOffer,
      createFarms,
      getFarms
   }
}
