export interface IUser {
  _id?: { toString(): string }
  username: string
  password: string
  isTeacher?: boolean
  createdAt?: Date
}
