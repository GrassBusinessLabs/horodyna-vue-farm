export interface CurrentUser {
   id: number
   email: string
   firstName: string
   gender: string
   image: string
   lastName: string
   token: string
   name: string
}

export interface ChangePassword {
   oldPassword: string,
   newPassword: string
}