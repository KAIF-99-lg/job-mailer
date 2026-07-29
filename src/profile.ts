import profileData from '../config/profile.json'

export interface UserProfile {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
  leetcode: string
  resumeFileName: string
  resumePath: string
  preferredDelay: number
  signature: string
}

export const getProfile = (): UserProfile => ({ ...profileData })
export default getProfile
