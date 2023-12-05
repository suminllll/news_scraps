import { configureStore } from '@reduxjs/toolkit'
import filterHomeModalReducer from './homeModal'
import filterScrapModalReducer from './scrapModal'
import modalStatusReducer from './modalStatus'
import scrapStatusReducer from './scraps'

//redux의 모든 state를 여기서 관리
const store = configureStore({
  reducer: {
    filterHomeModal: filterHomeModalReducer,
    filterScrapModal: filterScrapModalReducer,
    modalStatus: modalStatusReducer,
    scrapStatus: scrapStatusReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
