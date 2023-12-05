import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from '~/component/button'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer, Loading, activeFilterColor, normalFilterColor } from '~/styles/common'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterForm } from '~/types/modal'
import { setHomeFilterModal } from '~/redux/homeModal'
import { modalStatus } from '~/redux/modalStatus'
import { QueryClient, dehydrate, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import 'moment/locale/ko'
import NotValue from '~/component/notValue'
import { useInView } from 'react-intersection-observer'
import ReactLoading from 'react-loading'
import { findUrl, makeData, makeFilterData } from '~/utils/common'

const HomeScreen = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterHomeModal,
  )
  const [innerHeight, setInnerHeight] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [ref, inView] = useInView({ rootMargin: '0px 0px 10px 0px' })
  const [page, setPage] = useState(1)
  const [contentsList, setContentsList] = useState<ContentsList[]>([])
  const [isFilter, setIsFilter] = useState(false)
  const [filterButtonList, setFilterButtonList] = useState<
    { text: string; icon: React.SVGProps<SVGSVGElement> | string }[]
  >([{ text: '', icon: '' }])
  const [homeForm, setHomeForm] = useState<FilterForm>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: '',
  })

  useEffect(() => {
    setFilterButtonList(
      makeFilterData(headLineInputValue, selectedDate, tagSelectedList, modalOpen),
    )
  }, [selectedDate, tagSelectedList, headLineInputValue])

  useEffect(() => {
    const fetchScrapsData = async () => {
      setIsLoading(true)
      const url = findUrl(selectedDate, tagSelectedList, headLineInputValue, page)
      console.log(url)

      const res = await axios.get(url).then((res) => {
        const makeDataList: ContentsList[] = makeData(res.data.response.docs)
        console.log({ makeDataList })

        page > 1
          ? setContentsList((list) => [...list, ...makeDataList])
          : setContentsList(makeDataList)

        setIsLoading(false)
        return makeDataList
      })
      return res
    }
    fetchScrapsData()
  }, [page])

  useEffect(() => {
    if (inView && page < 10 && !isLoading) {
      // fetchNextPage()
      setPage((prev) => prev + 1)
    }
  }, [inView, isLoading, page])

  useEffect(() => {
    // console.log({ page })
    // console.log({ contentsList })
    // console.log({ isLoading })
    // console.log('hasNextPage', hasNextPage, isFetchingNextPage)
    // setContentsList(infiniteData?.pages[0])
  }, [contentsList, page])

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

  // if (isError) {
  //   return (
  //     <NotValue
  //       innerHeight={innerHeight}
  //       setInnerHeight={setInnerHeight}
  //       text="1분뒤에 다시 시도해주세요"
  //     />
  //   )
  // }

  return (
    <>
      <Headers>
        <ButtonContainer>
          {filterButtonList.map((item) => (
            <Button
              item={item}
              key={item.text}
              onClick={() => dispatch(modalStatus({ modalType: '/', isOpen: true }))}
              buttonStyle={modalOpen ? activeFilterColor : normalFilterColor}
            />
          ))}
        </ButtonContainer>
      </Headers>

      <>
        <ContentsList contentsList={contentsList} isFilter={isFilter} />
        {isLoading && page < 10 && (
          <Loading>
            <ReactLoading className="loading" type="spin" color="#ccc" height={24} width={24} />
          </Loading>
        )}
        <div ref={ref} />
      </>

      <FooterBar />
      <FilterModal
        onClose={onClose}
        form={homeForm}
        setForm={setHomeForm}
        onSubmitHandler={onSubmitHandler}
      />
    </>
  )
}

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
