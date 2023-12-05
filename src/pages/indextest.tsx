import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from '~/component/button'
import SearchIcon from '~/assets/icons/ico_search.svg'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import ModalPortal from '~/component/modal/modalConfig'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer, activeFilterColor, normalFilterColor } from '~/styles/common'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterForm } from '~/types/modal'
import { setHomeFilterModal } from '~/redux/homeModal'
import { modalStatus } from '~/redux/modalStatus'
import { QueryClient, dehydrate, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/ko'
import NotValue from '~/component/notValue'
import { GetServerSideProps, GetStaticProps } from 'next/types'
import { useInView } from 'react-intersection-observer'
import ReactLoading from 'react-loading'
import { makeData, makeFilterData } from '~/utils/common'

const HomeScreen = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  // const scrollRef = useRef<React.MutableRefObject<HTMLDivElement | null>>(null)
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterHomeModal,
  )
  const [ref, inView] = useInView({ rootMargin: '0px 0px 10px 0px' })
  const [innerHeight, setInnerHeight] = useState(0)
  const { isOpen, modalType } = useSelector((state: RootState) => state.modalStatus)
  const [page, setPage] = useState(1)
  const [contentsList, setContentsList] = useState<ContentsList[]>([])
  const [isFilter, setIsFilter] = useState(false)
  const [filterButtonList, setFilterButtonList] = useState<
    { text: string; icon: React.SVGProps<SVGSVGElement> | string }[]
  >([{ text: '', icon: '' }])
  const [form, setForm] = useState<FilterForm>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: '',
  })

  useEffect(() => {
    setFilterButtonList(
      makeFilterData(headLineInputValue, selectedDate, tagSelectedList, modalOpen),
    )
    // setFilterButtonList([
    //   {
    //     text: headLineInputValue !== '' ? headLineInputValue : '전체 헤드라인',
    //     icon: <SearchIcon fill={modalOpen ? '#82B0F4' : '#6D6D6D'} />,
    //   },
    //   {
    //     text: selectedDate !== null ? moment(selectedDate).format('YYYY.MM.DD') : '전체 날짜',
    //     icon: <CalenderIcon fill={modalOpen ? '#82B0F4' : '#6D6D6D'} />,
    //   },
    //   {
    //     text:
    //       tagSelectedList.length > 0
    //         ? tagSelectedList.length === 1
    //           ? `${tagSelectedList}`
    //           : `${tagSelectedList[0]} 외 ${tagSelectedList.length - 1}개`
    //         : '전체 국가',
    //     icon: '',
    //   },
    // ])
  }, [selectedDate, tagSelectedList, headLineInputValue])

  const fetchScrapsData = async (
    // page: number,
    // headLineInputValue: FilterForm['headLineInputValue'],
    // selectedDate: FilterForm['selectedDate'],
    // tagSelectedList: FilterForm['tagSelectedList'],
    { page, headLineInputValue, selectedDate, tagSelectedList },
  ) => {
    const KEY = process.env.NEXT_PUBLIC_API_KEY
    let apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${KEY}&page=${page}&sort=newest`

    if (headLineInputValue !== '') {
      apiUrl += `&q=${headLineInputValue}`
    }

    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYYMMDD')
      apiUrl += `&begin_date=${formattedDate}`
    }

    if (tagSelectedList.length > 0) {
      const countries = tagSelectedList.join(',')
      apiUrl += `&fq=news_desk:(${countries})`
    }
    console.log(apiUrl)

    const res = await axios.get(apiUrl)
    console.log({ res })

    const makeDataList: ContentsList[] = makeData(res.data.response.docs)
    console.log({ makeDataList })

    if (page > 1) {
      setContentsList((list) => [...list, ...makeDataList])
      return
    }
    setContentsList(makeDataList)
    return makeDataList
  }

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery(
    ['infiniteScrapsData', headLineInputValue, selectedDate, tagSelectedList],
    () =>
      fetchScrapsData({
        page,
        headLineInputValue,
        selectedDate,
        tagSelectedList,
        // setContentsList,
        // contentsList,
      }),
    {
      getNextPageParam: (lastPage) => lastPage,
    },
  )
  useEffect(() => {
    // if (inView && page < 10 && !isLoading) {
    //   // fetchNextPage()
    //   setPage((prev) => prev + 1)
    // }
    // return
  }, [inView, isLoading, page])

  useEffect(() => {
    console.log({ page })
    console.log({ contentsList })
    console.log({ isLoading })
    // console.log('hasNextPage', hasNextPage, isFetchingNextPage)
    // setContentsList(infiniteData?.pages[0])
  }, [contentsList, page])

  const onClickButtonHandler = () => {
    dispatch(modalStatus({ modalType: '/', isOpen: true }))
  }

  const onSubmitHandler = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()

    dispatch(
      setHomeFilterModal({
        selectedDate: selectedDate,
        tagSelectedList: tagSelectedList,
        headLineInputValue: headLineInputValue,
      }),
    )

    setPage(1)
    onClose()
    setIsFilter(true)
  }

  const onClose = () => {
    dispatch(modalStatus({ modalType: '', isOpen: false }))
  }

  useEffect(() => {
    //console.log({ page })
    // console.log('home', { selectedDate, tagSelectedList, headLineInputValue })
  }, [page])

  if (isError) {
    return (
      <NotValue
        innerHeight={innerHeight}
        setInnerHeight={setInnerHeight}
        text="1분뒤에 다시 시도해주세요"
      />
    )
  }

  return (
    <>
      <Headers>
        <ButtonContainer>
          {filterButtonList.map((item) => (
            <Button
              item={item}
              key={item.text}
              onClick={() => onClickButtonHandler()}
              buttonStyle={modalOpen ? activeFilterColor : normalFilterColor}
            />
          ))}
        </ButtonContainer>
      </Headers>

      <>
        <ContentsList contentsList={contentsList} isFilter={isFilter} />
        {isLoading && page < 10 && (
          // <NotValue innerHeight={innerHeight} setInnerHeight={setInnerHeight} text="Loading..." />
          <Loading>
            <ReactLoading className="loading" type="spin" color="#ccc" height={24} width={24} />
          </Loading>
        )}
        <div ref={ref} />
      </>

      <FooterBar />
      <FilterModal
        onClose={onClose}
        form={form}
        setForm={setForm}
        onSubmitHandler={onSubmitHandler}
      />
    </>
  )
}

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -70px;
  margin-bottom: 110px;
`
const Headers = styled.header`
  height: 60px;
  width: 100%;
  padding: 13px 20px;
`

export default HomeScreen
// const fetchData = async () => {
//   const KEY = process.env.NEXT_PUBLIC_API_KEY
//   let apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?limit=10&api-key=${KEY}`
//   try {
//     const response = await axios.get(apiUrl)
//     const data = response.data.response.docs
//     console.log({ response })

//     return data
//   } catch (error) {
//     console.error('Error fetching data:', error)
//     throw error
//   }
// }
// export const getStaticProps: GetStaticProps = async () => {
//   const queryClient = new QueryClient()

//   await queryClient.fetchQuery(['serverside'], fetchData)

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   }
// }
