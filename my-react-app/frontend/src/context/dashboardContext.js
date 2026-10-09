import { createContext, useContext } from 'react'

export const DashboardContext = createContext(null)

export function useDashboard() {
  const data = useContext(DashboardContext)
  if (!data) throw new Error('useDashboard needs DashboardProvider around it')
  return data
}
