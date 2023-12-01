import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterForm } from '~/types/modal'
import { initialState } from './homeModal'
//만들고 스토어에 저장 필수

export const filterScrapModalSlice = createSlice({
  name: 'filterScrapModal',
  initialState,
  reducers: {
    setScrapFilterModal: (state: FilterForm, action: PayloadAction<FilterForm>) => {
      const { selectedDate, tagSelectedList, headLineInputValue } = action.payload
      state.selectedDate = selectedDate
      state.tagSelectedList = tagSelectedList
      state.headLineInputValue = headLineInputValue
    },
  },
})
export const { setScrapFilterModal } = filterScrapModalSlice.actions
export default filterScrapModalSlice.reducer
