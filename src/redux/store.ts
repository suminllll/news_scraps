import { configureStore } from '@reduxjs/toolkit'
import filterHomeModalReducer from './homeModal'
import filterScrapModalReducer from './scrapModal'
import modalStatusReducer from './modalStatus'

//redux의 모든 state를 여기서 관리
const store = configureStore({
  reducer: {
    filterHomeModal: filterHomeModalReducer,
    filterScrapModal: filterScrapModalReducer,
    modalStatus: modalStatusReducer,
  },
})

export type AppDispatch = typeof store.dispatch
// export type filterHomeModalState = ReturnType<typeof store.getState>
// export type filterScrapModalState = ReturnType<typeof store.getState>
export type RootState = ReturnType<typeof store.getState>

export default store
