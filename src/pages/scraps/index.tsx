import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '~/component/button'
import SearchIcon from '~/assets/icons/ico_search.svg'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import ModalPortal from '~/component/modal/modalConfig'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer } from '~/styles/common'

import { useRouter } from 'next/router'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterForm } from '~/types/modal'
import { setScrapFilterModal } from '~/redux/scrapModal'
import { modalStatus } from '~/redux/modalStatus'
import NotValue from '~/component/notValue'
import { getCookie } from '~/utils/cookies'
import { Scraps, scrapStatus } from '~/redux/scraps'
import moment from 'moment'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
const KEY = process.env.NEXT_PUBLIC_API_KEY
const ScrapsScreen = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [innerHeight, setInnerHeight] = useState(0)
  const [isScrap, setIsScrap] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { scrapList }: Scraps = useSelector((state: RootState) => state.scrapStatus)
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterScrapModal,
  )
  const { isOpen, modalType } = useSelector((state: RootState) => state.modalStatus)
  const [contentsList, setContentsList] = useState<ContentsList[]>([])
  const [page, setPage] = useState(1)
  const [isFilter, setIsFilter] = useState(false)
  const [filterButtonList, setFilterButtonList] = useState([{ text: '', icon: '' }])
  const [form, setForm] = useState<FilterForm>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: '',
  })

  const activeFilterColor = {
    color: '#82B0F4',
    borderColor: '#82B0F4',
    backColor: '#ffffff',
  }
  const normalFilterColor = {
    color: '#6D6D6D',
    borderColor: '#c4c4c4',
    backColor: '#ffffff',
  }

  useEffect(() => {
    getCookieHandler()
  }, [])

  const getCookieHandler = () => {
    const list = getCookie('scraps_list')
    dispatch(scrapStatus({ scrapList: list !== undefined ? list : [] }))
    //refetch()
  }

  const fetchScrapsData = async ({
    pageParam = 1,
    headLineInputValue,
    selectedDate,
    tagSelectedList,
  }) => {
    console.log('in')

    const KEY = process.env.NEXT_PUBLIC_API_KEY
    let apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?limit=10&api-key=${KEY}&page=${pageParam}`

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

    const res = await axios.get(apiUrl)
    // console.log({ res })

    const makeDataList = res.data.response.docs
      .filter((item) => scrapList.includes(item._id))
      .map((item) => ({
        ...item,
        headline: item.headline.main,
        byline: item.byline.original,
        date: moment(item.pub_date).format('YYYY.MM.DD (dd)'),
      }))
    // console.log({ makeDataList })
    setContentsList((prev) => {
      const newContentsList = [...makeDataList.map((page) => page)]
      return Array.from(new Set(newContentsList))
    })
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
    ({ pageParam }) =>
      fetchScrapsData({
        pageParam,
        headLineInputValue,
        selectedDate,
        tagSelectedList,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage?.length > 0 && lastPage[lastPage.length - 1].page + 1,
    },
  )

  useEffect(() => {
    setFilterButtonList([
      {
        text: headLineInputValue !== '' ? headLineInputValue : '전체 헤드라인',
        icon: <SearchIcon fill={modalOpen ? '#82B0F4' : '#6D6D6D'} />,
      },
      {
        text: selectedDate !== null ? moment(selectedDate).format('YYYY.MM.DD') : '전체 날짜',
        icon: <CalenderIcon fill={modalOpen ? '#82B0F4' : '#6D6D6D'} />,
      },
      {
        text:
          tagSelectedList.length > 0
            ? tagSelectedList.length === 1
              ? `${tagSelectedList}`
              : `${tagSelectedList[0]} 외 ${tagSelectedList.length - 1}개`
            : '전체 국가',
        icon: '',
      },
    ])
  }, [selectedDate, tagSelectedList, headLineInputValue])

  useEffect(() => {
    //if (!isLoading) refetch()
  }, [isLoading])

  const onClickButtonHandler = () => {
    dispatch(modalStatus({ modalType: '/scraps', isOpen: true }))
  }

  const onSubmitHandler = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()

    dispatch(
      setScrapFilterModal({
        selectedDate: form.selectedDate,
        tagSelectedList: form.tagSelectedList,
        headLineInputValue: form.headLineInputValue,
      }),
    )
    setIsFilter(true)
    fetchNextPage(1)
    // if (hasNextPage && !isFetchingNextPage) {
    //   fetchNextPage()
    //   onClose()
    // }

    onClose()
  }

  const onClose = () => {
    dispatch(modalStatus({ modalType: '/scraps', isOpen: false }))
  }

  useEffect(() => {
    console.log({ contentsList })
    console.log({ scrapList })
    console.log({ isLoading })
    // console.log({ data })
    // setContentsList(infiniteData?.pages[0])
    //console.log('scrap', { selectedDate, tagSelectedList, headLineInputValue })
  }, [contentsList, scrapList, isLoading])

  if (isLoading) {
    return <NotValue innerHeight={innerHeight} setInnerHeight={setInnerHeight} text="Loading..." />
  }

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
      {contentsList.length > 0 && innerHeight > 0 && scrapList.length > 0 ? (
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
          <ContentsList
            contentsList={contentsList}
            getCookieHandler={getCookieHandler}
            isFilter={isFilter}
          />
        </>
      ) : (
        <NotValue
          innerHeight={innerHeight}
          setInnerHeight={setInnerHeight}
          text="저장된 스크랩이 없습니다."
          btnText="스크랩 하러 가기"
          onClick={() => router.push('/')}
        />
      )}
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
const Headers = styled.header`
  height: 60px;
  width: 100%;
  padding: 13px 20px;
`

export default ScrapsScreen
