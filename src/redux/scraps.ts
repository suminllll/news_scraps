import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface Scraps {
  scrapList: ContentsList[]
}

const initialState = {
  scrapList: [],
}

export const scrapSlice = createSlice({
  name: 'scraps',
  initialState,
  reducers: {
    scrapStatus: (state: Scraps, action: PayloadAction<Scraps>) => {
      const { scrapList } = action.payload
      state.scrapList = scrapList
    },
  },
})
export const { scrapStatus } = scrapSlice.actions
export default scrapSlice.reducer
