export interface CurrentUser {
   id: number
   email: string
   firstName: string
   gender: string
   image: string
   lastName: string
   token: string
   name: string
   phone_number: string | undefined
}

export interface UserName {
   name: string | null
}
export interface ChangePassword {
   oldPassword: string,
   newPassword: string
}