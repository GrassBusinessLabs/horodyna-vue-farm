import {useRouter} from 'vue-router'

export const useRouting = () => {
   const router = useRouter()

   async function toSignIn() {
      return router.push('/sign-in')
   }

   async function toPosts() {
      return router.push('/posts')
   }

   async function toCatalog() {
      return router.push('/catalog')
   }

   return {
      toSignIn,
      toPosts,
      toCatalog
   }
}
