// import axios from 'axios'
// import moment from 'moment'
// import { FilterForm } from '~/types/modal'
// import { makeData } from './common'
// import { useRouter } from 'next/router'

// export const fetchScrapsData = async (
//   page: number,
//   headLineInputValue: FilterForm['headLineInputValue'],
//   selectedDate: FilterForm['selectedDate'],
//   tagSelectedList: FilterForm['tagSelectedList'],
//   setContentsList: React.Dispatch<React.SetStateAction<ContentsList[]>>,
//   contentsList: ContentsList[],
//   scrapList?: string[],
// ) => {
//   const router = useRouter()
//   console.log('in')

//   const KEY = process.env.NEXT_PUBLIC_API_KEY
//   let apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${KEY}&page=${page}`
//   console.log('scrap', { selectedDate, tagSelectedList, headLineInputValue })

//   if (headLineInputValue !== '') {
//     // apiUrl += `&q=${headLineInputValue}`
//     apiUrl += `&fq=headline:${headLineInputValue}`
//   }

//   if (selectedDate) {
//     const formattedDate = moment(selectedDate).format('YYYYMMDD')
//     apiUrl += `&begin_date=${formattedDate}`
//   }

//   if (tagSelectedList.length > 0) {
//     const countries = tagSelectedList.join(',')
//     apiUrl += `&fq=news_desk:(${countries})`
//   }

//   const res = await axios.get(apiUrl)
//   console.log({ res })

//   let makeDataList = res.data.response.docs

//   if (router.pathname === '/scraps') {
//     makeDataList = makeData(
//       makeDataList.filter((item: { _id: string }) => scrapList.includes(item._id)),
//     )

//     console.log({ makeDataList })
//     setContentsList(() => {
//       const newContentsList = [...makeDataList.map((item: ContentsListProps) => item)]
//       return Array.from(new Set(newContentsList))
//     })
//   } else {
//     makeDataList = makeData(makeDataList)
//   }

//   if (page > 1) {
//     setContentsList((list) => [...list, ...makeDataList])
//     return
//   }

//   setContentsList(makeDataList)

//   return makeDataList
// }
