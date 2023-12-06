import React, { useEffect, useLayoutEffect, useState } from 'react'
import Button from '~/component/button'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer, Loading, Headers } from '~/styles/common'
import { useRouter } from 'next/router'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterButton, FilterForm } from '~/types/modal'
import { setScrapFilterModal } from '~/redux/scrapModal'
import { modalStatus } from '~/redux/modalStatus'
import NotValue from '~/component/notValue'
import { Scraps } from '~/redux/scraps'
import axios from 'axios'
import { findUrl, getCookieHandler, makeData, makeFilterData } from '~/utils/common'
import { useInView } from 'react-intersection-observer'
import ReactLoading from 'react-loading'
import moment from 'moment'

const ScrapsScreen = () => {
  const { isOpen } = useSelector((state: RootState) => state.modalStatus)
  const [innerHeight, setInnerHeight] = useState(0)
  const router = useRouter()
  const dispatch = useDispatch()
  const { scrapList }: Scraps = useSelector((state: RootState) => state.scrapStatus)
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterScrapModal,
  )
  const [ref, inView] = useInView({ rootMargin: '0px 0px 10px 0px' })
  const [scrapContentsList, setScrapContentsList] = useState<ScrapContentsList>({
    list: [],
    page: 1,
    totalPage: 0,
  })
  const [page, setPage] = useState(1)
  const [isFilter, setIsFilter] = useState(false)
  const [filterButtonList, setFilterButtonList] = useState<FilterButton[]>([
    { text: '', icon: '', color: { color: '', backColor: '', borderColor: '' } },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [scrapForm, setScrapForm] = useState<FilterForm>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: null,
  })

  useLayoutEffect(() => {
    getCookieHandler(dispatch)
  }, [])

  useEffect(() => {
    if (scrapList.length > 0) {
      const fetchScrapsData = async () => {
        setIsLoading(true)
        const url = findUrl(selectedDate, tagSelectedList, headLineInputValue, page)

        try {
          const res = await axios.get(url)

          const makeDataList: ScrapContentsList['list'] = makeData(
            res.data.response.docs.filter((item: { _id: string }) => scrapList.includes(item._id)),
          )
          console.log({ makeDataList })

          getMakeData(makeDataList)
        } catch (err) {
          console.log({ err })
          setIsError(true)
        }
      }

      fetchScrapsData()
    }
  }, [scrapList])

  const getMakeData = (makeDataList: ScrapContentsList['list']) => {
    setScrapContentsList((prevContents) => {
      if (page > 1) {
        const startIdx = (page - 1) * 10
        const endIdx = startIdx + 10
        const newItems = makeDataList.slice(startIdx, endIdx)

        return {
          ...prevContents,
          list: [...prevContents.list, ...newItems],
          page,
          totalPage: makeDataList.length / 10,
        }
      }

      return {
        list: [...makeDataList.slice(0, 10)],
        page,
        totalPage: makeDataList.length / 10 < 1 ? 1 : makeDataList.length / 10,
      }
    })

    setIsLoading(false)
    return
  }

  useEffect(() => {
    setFilterButtonList(makeFilterData(headLineInputValue, selectedDate, tagSelectedList))

    if (isFilter) {
      const filter = scrapContentsList.list.filter((item) => {
        const conditions = []
        console.log('i', headLineInputValue)

        if (headLineInputValue) {
          conditions.push(item.headline.includes(headLineInputValue))
        }

        if (selectedDate) {
          conditions.push(moment(selectedDate).format('YYYY.MM.DD (dd)') === item.date)
        }

        if (tagSelectedList.length > 0) {
          const tagMatches = tagSelectedList.some(
            (tag) => item.headline.includes(tag.value) || item.abstract.includes(tag.value),
          )
          conditions.push(tagMatches)
        }
        console.log({ conditions })

        if (conditions.length === 3) {
          return conditions.every(Boolean)
        } else if (conditions.length === 2) {
          console.log(conditions.every(Boolean))

          return conditions.every(Boolean)
        } else if (conditions.length === 1) {
          return conditions[0] //
        } else {
          return false
        }
      })
      console.log({ filter })
      getMakeData(filter)
    }
  }, [selectedDate, tagSelectedList, headLineInputValue])

  useEffect(() => {
    if (inView && page < 10 && !isLoading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, isLoading, page])

  useEffect(() => {
    //  console.log({ headLineInputValue })
    console.log({ scrapContentsList })
    console.log({ scrapList })
    //  console.log({ isLoading })
  }, [scrapContentsList, scrapList, isLoading, headLineInputValue])

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
      {innerHeight > 0 && scrapList.length > 0 ? (
        <>
          <Headers>
            <ButtonContainer>
              {filterButtonList.map((item) => (
                <Button
                  item={item}
                  key={item.text}
                  onClick={() => onClickButtonHandler()}
                  buttonStyle={item.color}
                />
              ))}
            </ButtonContainer>
          </Headers>
          <ContentsList contentsList={scrapContentsList.list} isFilter={isFilter} />
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

export default ScrapsScreen
