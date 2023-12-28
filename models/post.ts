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
   title: string
   userId: number
   tags?: string[]
   reactions?: number
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
      name: string,
      data: string
   }

}
export interface changeOffer {
   title: string,
   description: string,
   category: string,
   price: number,
   unit: string,
   stock: number,
   farm_id: number,
   image: {
      name: string,
      data: string
   }
}