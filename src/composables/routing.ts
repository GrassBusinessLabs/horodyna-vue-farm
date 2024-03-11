import {useRouter} from 'vue-router'

export const useRouting = () => {
   const router = useRouter()

   async function toSignIn() {
      return router.replace('/sign-in')
   }

   async function toPosts() {
      return router.replace('/posts')
   }

   return {
      toSignIn,
      toPosts,
   }
}
