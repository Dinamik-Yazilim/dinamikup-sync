export interface ManagerType {
  _id?: string
  username?: string
  email?: string
  password?: string
  phoneNumber?: string
  role?: string
  passive?: boolean
  title?: string
  fullName?: string
  firstName?: string
  lastName?: string
  gender?: string | '' | 'male' | 'female' | 'other' | undefined
  dateOfBirth?: string
  image?: any
  bio?: string
  location?: string
  links?: string[]
  married?: boolean
  children?: number
}