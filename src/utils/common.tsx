import moment from 'moment'

export const makeData = (dataList: FormattedContentsList[]): ContentsList[] => {
  return dataList.map((item) => ({
    ...item,
    headline: item.headline.main,
    byline: item.byline.original,
    date: moment(item.pub_date).format('YYYY.MM.DD (dd)'),
  }))
}

import SearchIcon from '~/assets/icons/ico_search.svg'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import { FilterButton, FilterForm } from '~/types/modal'
import { scrapStatus } from '~/redux/scraps'
import { getCookie } from './cookies'
import { AnyAction } from '@reduxjs/toolkit'

export const makeFilterData = (
  headLineInputValue: FilterForm['headLineInputValue'],
  selectedDate: FilterForm['selectedDate'],
  tagSelectedList: FilterForm['tagSelectedList'],
) => {
  return [
    {
      text: checkedNull(headLineInputValue) ? headLineInputValue : '전체 헤드라인',
      icon: <SearchIcon fill={checkedNull(headLineInputValue) ? '#82B0F4' : '#6D6D6D'} />,
      color: checkedNull(headLineInputValue)
        ? { color: '#82B0F4', borderColor: '#82B0F4', backColor: '#ffffff' }
        : { color: '#6D6D6D', borderColor: '#c4c4c4', backColor: '#ffffff' },
    },
    {
      text: checkedNull(selectedDate) ? moment(selectedDate).format('YYYY.MM.DD') : '전체 날짜',
      icon: <CalenderIcon fill={checkedNull(selectedDate) ? '#82B0F4' : '#6D6D6D'} />,
      color: checkedNull(selectedDate)
        ? { color: '#82B0F4', borderColor: '#82B0F4', backColor: '#ffffff' }
        : { color: '#6D6D6D', borderColor: '#c4c4c4', backColor: '#ffffff' },
    },
    {
      text:
        tagSelectedList.length > 0
          ? tagSelectedList.length === 1
            ? `${tagSelectedList[0].text}`
            : `${tagSelectedList[0].text} 외 ${tagSelectedList.length - 1}개`
          : '전체 국가',
      icon: '',
      color:
        tagSelectedList.length > 0
          ? { color: '#82B0F4', borderColor: '#82B0F4', backColor: '#ffffff' }
          : { color: '#6D6D6D', borderColor: '#c4c4c4', backColor: '#ffffff' },
    },
  ]
}

export const checkedNull = (data: any) => {
  return data !== null && data !== '' ? true : false
}

export const findUrl = (
  selectedDate: FilterForm['selectedDate'],
  tagSelectedList: FilterForm['tagSelectedList'],
  headLineInputValue: FilterForm['headLineInputValue'],
  page: number,
) => {
  const KEY = process.env.NEXT_PUBLIC_API_KEY
  let apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${KEY}&page=${page}`

  if (headLineInputValue !== '' && headLineInputValue !== null) {
    apiUrl += `&fq=headline:${headLineInputValue}`
  }

  if (selectedDate) {
    console.log({ selectedDate })

    const formattedDate = moment(selectedDate).format('YYYYMMDD')
    apiUrl += `&begin_date=${formattedDate}`
  }

  if (tagSelectedList.length > 0) {
    let countries: string[] = []
    tagSelectedList.map((item) => countries.push(item.value))
    apiUrl += `&q=(${countries})`
  }

  return apiUrl
}

export const getCookieHandler = (dispatch: React.Dispatch<AnyAction>) => {
  const list = getCookie('scraps_list')
  dispatch(scrapStatus({ scrapList: list !== undefined ? list : [] }))
}
