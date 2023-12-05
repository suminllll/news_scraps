import React, { useEffect, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '~/component/button'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer, Loading, activeFilterColor, normalFilterColor } from '~/styles/common'
import { useRouter } from 'next/router'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterForm } from '~/types/modal'
import { setScrapFilterModal } from '~/redux/scrapModal'
import { modalStatus } from '~/redux/modalStatus'
import NotValue from '~/component/notValue'
import { Scraps, scrapStatus } from '~/redux/scraps'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { findUrl, getCookieHandler, makeData, makeFilterData } from '~/utils/common'
import { useInView } from 'react-intersection-observer'
import ReactLoading from 'react-loading'

const ScrapsScreen = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [innerHeight, setInnerHeight] = useState(0)
  const router = useRouter()
  const dispatch = useDispatch()
  const { scrapList }: Scraps = useSelector((state: RootState) => state.scrapStatus)
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterScrapModal,
  )
  const [ref, inView] = useInView({ rootMargin: '0px 0px 10px 0px' })
  const [contentsList, setContentsList] = useState<ContentsList[]>([])
  const [page, setPage] = useState(1)
  const [isFilter, setIsFilter] = useState(false)
  const [filterButtonList, setFilterButtonList] = useState<
    { text: string; icon: React.SVGProps<SVGSVGElement> | string }[]
  >([{ text: '', icon: '' }])

  const [scrapForm, setScrapForm] = useState<FilterForm>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: '',
  })

  useLayoutEffect(() => {
    getCookieHandler(dispatch)
  }, [])

  const fetchScrapsData = async (
    page: number,
    headLineInputValue: FilterForm['headLineInputValue'],
    selectedDate: FilterForm['selectedDate'],
    tagSelectedList: FilterForm['tagSelectedList'],
    scrapList: string[],
  ) => {
    const url = findUrl(selectedDate, tagSelectedList, headLineInputValue, page)

    const res = await axios.get(url)
    console.log({ res })

    const makeDataList: ContentsList[] = makeData(
      res.data.response.docs.filter((item: { _id: string }) => scrapList.includes(item._id)),
    )

    console.log({ makeDataList })
    setContentsList(() => {
      const newContentsList: ContentsList[] = [...makeDataList.map((item) => item)]
      return Array.from(new Set(newContentsList))
    })

    console.log({ makeDataList })

    if (page > 1) {
      setContentsList((list) => [...list, ...makeDataList])
      return
    }
    setContentsList(makeDataList)
    return makeDataList
  }

  const { isLoading, isError } = useInfiniteQuery(
    ['infiniteScraps', headLineInputValue, selectedDate, tagSelectedList, scrapList],
    () => fetchScrapsData(page, headLineInputValue, selectedDate, tagSelectedList, scrapList),
  )

  useEffect(() => {
    setFilterButtonList(
      makeFilterData(headLineInputValue, selectedDate, tagSelectedList, modalOpen),
    )
  }, [selectedDate, tagSelectedList, headLineInputValue])

  useEffect(() => {
    if (inView && page < 10 && !isLoading) {
      // fetchNextPage()
      setPage((prev) => prev + 1)
    }
    return
  }, [inView, isLoading, page])

  useEffect(() => {
    //  console.log({ tagSelectedList })
  }, [tagSelectedList])

  const onClickButtonHandler = () => {
    dispatch(modalStatus({ modalType: '/scraps', isOpen: true }))
  }

  const onSubmitHandler = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()

    dispatch(
      setScrapFilterModal({
        selectedDate: scrapForm.selectedDate,
        tagSelectedList: scrapForm.tagSelectedList,
        headLineInputValue: scrapForm.headLineInputValue,
      }),
    )

    setIsFilter(true)
    onClose()
  }

  const onClose = () => {
    dispatch(modalStatus({ modalType: '/scraps', isOpen: false }))
  }

  useEffect(() => {
    //console.log({ contentsList })
    // console.log({ scrapList })
    // console.log({ infiniteData })
    // console.log({ isLoading })
    // console.log({ data })
    // setContentsList(infiniteData?.pages[0])
    // console.log('scrap', { selectedDate, tagSelectedList, headLineInputValue })
  }, [contentsList, scrapList, isLoading, selectedDate, tagSelectedList, headLineInputValue])

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
      {innerHeight > 0 && scrapList.length > 0 ? (
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
          <ContentsList contentsList={contentsList} isFilter={isFilter} />
          {isLoading && page < 10 && (
            <Loading>
              <ReactLoading className="loading" type="spin" color="#ccc" height={24} width={24} />
            </Loading>
          )}
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
        form={scrapForm}
        setForm={setScrapForm}
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
