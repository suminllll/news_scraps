import React, { useEffect, useState } from 'react'
import Button from '~/component/button'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer, Loading } from '~/styles/common'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterButton, FilterForm } from '~/types/modal'
import { setHomeFilterModal } from '~/redux/homeModal'
import { modalStatus } from '~/redux/modalStatus'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import 'moment/locale/ko'
import NotValue from '~/component/notValue'
import { useInView } from 'react-intersection-observer'
import ReactLoading from 'react-loading'
import { findUrl, makeData, makeFilterData } from '~/utils/common'
import { Headers } from '../styles/common'

const HomeScreen = () => {
  const { isOpen } = useSelector((state: RootState) => state.modalStatus)
  const dispatch = useDispatch()
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterHomeModal,
  )
  const [innerHeight, setInnerHeight] = useState(0)
  const [ref, inView] = useInView({ rootMargin: '0px 0px 10px 0px' })
  const [page, setPage] = useState(1)
  const [contentsList, setContentsList] = useState<ContentsList[]>([])
  const [isFilter, setIsFilter] = useState(false)
  const [filterButtonList, setFilterButtonList] = useState<FilterButton[]>([
    {
      text: '',
      icon: '',
      color: { color: '', backColor: '', borderColor: '' },
    },
  ])
  const [homeForm, setHomeForm] = useState<FilterForm>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: null,
  })

  const fetchScrapsData = async (
    page: number,
    headLineInputValue: FilterForm['headLineInputValue'],
    selectedDate: FilterForm['selectedDate'],
    tagSelectedList: FilterForm['tagSelectedList'],
  ) => {
    console.log(selectedDate, tagSelectedList, headLineInputValue)

    const url = findUrl(selectedDate, tagSelectedList, headLineInputValue, page)
    console.log({ url })

    const res = await axios.get(url)
    const makeDataList: ContentsList[] = makeData(res.data.response.docs)
    console.log({ makeDataList })

    page > 1 ? setContentsList((list) => [...list, ...makeDataList]) : setContentsList(makeDataList)

    return makeDataList
  }

  const { isLoading, isError } = useInfiniteQuery(
    ['infiniteScraps', headLineInputValue, selectedDate, tagSelectedList],
    () => fetchScrapsData(page, headLineInputValue, selectedDate, tagSelectedList),
  )

  useEffect(() => {
    if (inView && page < 10 && !isLoading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, isLoading])

  useEffect(() => {
    setFilterButtonList(makeFilterData(headLineInputValue, selectedDate, tagSelectedList))
  }, [selectedDate, tagSelectedList, headLineInputValue])

  useEffect(() => {
    // console.log({ page })
    // console.log({ contentsList })
    // console.log({ isLoading })
    // console.log({ isOpen })
    // console.log({ filterButtonList })
  }, [contentsList, page, isLoading, filterButtonList])

  const onSubmitHandler = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()

    dispatch(
      setHomeFilterModal({
        selectedDate: homeForm.selectedDate,
        tagSelectedList: homeForm.tagSelectedList,
        headLineInputValue: homeForm.headLineInputValue,
      }),
    )

    setPage(1)
    onClose()
    setIsFilter(true)
  }

  const onClose = () => {
    dispatch(modalStatus({ modalType: '', isOpen: false }))
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
      <Headers>
        <ButtonContainer>
          {filterButtonList.map((item) => (
            <Button
              item={item}
              key={item.text}
              onClick={() => dispatch(modalStatus({ modalType: '/', isOpen: true }))}
              buttonStyle={item.color}
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

export default HomeScreen
