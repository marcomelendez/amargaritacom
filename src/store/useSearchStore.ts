import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RoomState {
  adults: number
  children: number
  childrenAges: number[]
}

interface SearchState {
  checkIn: string | null
  checkOut: string | null
  rooms: RoomState[]
  setSearch: (checkIn: string | null, checkOut: string | null, rooms: RoomState[]) => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      checkIn: null,
      checkOut: null,
      rooms: [{ adults: 2, children: 0, childrenAges: [] }],
      setSearch: (checkIn, checkOut, rooms) => set({ checkIn, checkOut, rooms }),
    }),
    {
      name: 'amargarita-search-storage',
    }
  )
)
