import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterForm } from '~/types/modal'
//만들고 스토어에 저장 필수
export const initialState: FilterForm = {
  selectedDate: null,
  tagSelectedList: [],
  headLineInputValue: null,
}

export const filterHomeModalSlice = createSlice({
  name: 'filterHomeModal',
  initialState,
  reducers: {
    setHomeFilterModal: (state: FilterForm, action: PayloadAction<FilterForm>) => {
      const { selectedDate, tagSelectedList, headLineInputValue } = action.payload
      state.selectedDate = selectedDate
      state.tagSelectedList = tagSelectedList
      state.headLineInputValue = headLineInputValue
    },
  },
})
export const { setHomeFilterModal } = filterHomeModalSlice.actions
export default filterHomeModalSlice.reducer
