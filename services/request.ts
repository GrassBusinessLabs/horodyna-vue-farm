import {apiService} from '@/services/api'
import type {AddPostBody, CurrentUser, GetPostsResponse, LoginBody, Post, createOffer, changeOffer} from '@/models'

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
   async function getOffers() {
      return api.get('/offers')
   }
   async  function changeOffer(offerid:any, body: changeOffer){
      return api.put(`/offers/${offerid}`, body)
   }
   return {
      login,
      createOffer,
      getCategories,
      getCurrentUser,
      logout,
      addPost,
      getOffers,
      changeOffer
   }
}
