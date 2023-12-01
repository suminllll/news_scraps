import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ModalStatus {
  isOpen: boolean
  modalType: string
}

const initialState = {
  isOpen: false,
  modalType: '',
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalStatus: (state: ModalStatus, action: PayloadAction<ModalStatus>) => {
      const { isOpen, modalType } = action.payload
      state.modalType = modalType
      state.isOpen = isOpen
    },
  },
})
export const { modalStatus } = modalSlice.actions
export default modalSlice.reducer
