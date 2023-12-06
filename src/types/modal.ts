import moment from 'moment'

export type FilterForm = {
  selectedDate: null | string | Date
  tagSelectedList: { text: string; value: string }[]
  headLineInputValue: string | null
}

export type FilterButton = {
  text: string | null
  icon: React.ReactNode
  color: {
    color: string
    backColor: string
    borderColor: string
  }
}
