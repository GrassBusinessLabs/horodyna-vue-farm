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
   farmResponce, ChangePassword
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
   return {
      changePassword,
      login,
      register,
      createOffer,
      getCategories,
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
