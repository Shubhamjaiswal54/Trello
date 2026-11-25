export interface Organization {
  _id: string
  name: string
  owner: string
  members: string[]
}

export interface Member {
  _id: string
  name: string
  email: string
}

export interface OrganizationDetails {
  _id: string
  name: string
  owner: Member
  members: Member[]
}

export interface Department {
  _id: string
  name: string
  orgId: string
}

export interface Board {
  _id: string
  name: string
  departmentId: string
  orgId: string
  createdAt?: string
}

export type CardPosition = '' | 'A' | 'B' | 'C'

export interface CardItem {
  uuid: string
  text: string
  pos: CardPosition
  boardId: string
}

export interface NamedRef {
  _id: string
  name: string
}
