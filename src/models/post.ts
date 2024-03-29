import type {Pagination} from '@/models/pagination'

export interface Post {
   id: number
   body: string
   title: string
   category: string
   price: number
   unit: string
   stock: number
   userId: number
   tags?: string[]
   reactions?: number
}

export type GetPostsResponse = Pagination<{posts: Post[]}>

export interface AddPostBody {
   body: string
   photo: string
   category: string
   price: number
   unit: string
   stock: number
   title: string
   userId: number

}
export  interface createFarms{
   name: string
   city: string
   address: string
   latitude: number
   longitude: number
}

export interface changeFarm {
   name: string
   city: string
   address: string
   latitude: number
   longitude: number
}

{

}
export  interface farmResponce{
   items:[{
      id: number
      name: string
      city: string
      address: string
      latitude: number
      longitude: number
      user:{
         id: number,
         name: string,
         email: string

      }
   }


   ]
   total: number
   pages: number
}
export interface createOffer{
   title: string,
   description: string,
   category: string,
   price: number,
   unit: string,
   stock: number,
   farm_id: number,
   image: {
      name: string | null,
      data: string | null
   }

}
export interface changeOffer {
   id: number,
   title: string,
   description: string,
   category: string,
   price: number,
   status: boolean,
   unit: string,
   stock: number,
   farm_id: number,
   image: {
      name: string | null,
      data: string | null
   }
}