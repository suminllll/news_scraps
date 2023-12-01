import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Button from '~/component/button'
import SearchIcon from '~/assets/icons/ico_search.svg'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import ModalPortal from '~/component/modal/modalConfig'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer } from '~/styles/common'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterForm } from '~/types/modal'
import { setHomeFilterModal } from '~/redux/homeModal'
import { modalStatus } from '~/redux/modalStatus'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/ko'

const HomeScreen = () => {
  const KEY = process.env.NEXT_PUBLIC_API_KEY
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const scrollRef = useRef<React.MutableRefObject<HTMLDivElement | null>>(null)
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterHomeModal,
  )
  const { isOpen, modalType } = useSelector((state: RootState) => state.modalStatus)
  const [page, setPage] = useState(1)
  const [contentsList, setContentsList] = useState([])
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
    const fetch = async (pageParam: number) => {
      const begin_date = selectedDate !== null ? moment(selectedDate).format('YYYYMMDD') : ''
      const keyword = [headLineInputValue, ...tagSelectedList]
      axios
        .get(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=${keyword}&page=${page}&limit=10&api-key=${KEY}`,
        )
        .then((data) => {
          const result = data.data.response
          const makeDataList = result.docs.map((item) => {
            return {
              ...item,
              headLine: item.headline.main,
              byline: item.byline.original,
              date: moment(item.pub_date).format('YYYY.MM.DD (dd)'),
            }
          })
          setContentsList(makeDataList)
          console.log({ data })
        })
    }
    fetch()
  }, [selectedDate, tagSelectedList, headLineInputValue])
  //  const res = useInfiniteQuery('homeNews', ({ pageParam = 1 }) => fetch(pageParam), {
  // getNextPageParam: (lastPage, pages) => {
  //   console.log({ lastPage })
  // },
  // })

  const onClickButtonHandler = () => {
    dispatch(modalStatus({ modalType: '/', isOpen: true }))
  }

  const onSubmitHandler = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()

    dispatch(
      setHomeFilterModal({
        selectedDate: form.selectedDate,
        tagSelectedList: form.tagSelectedList,
        headLineInputValue: form.headLineInputValue,
      }),
    )
    onClose()
  }

  const onClose = () => {
    dispatch(modalStatus({ modalType: '', isOpen: false }))
  }

  const handleIntersect = () => {
    setPage((page) => page + 1)
    // getList()
  }

  useEffect(() => {
    const currentScrollRef = scrollRef.current

    const options = {
      root: null,
      rootMargin: '30px',
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) handleIntersect()
    }, options)

    if (currentScrollRef) {
      observer.observe(currentScrollRef)
    }

    return () => {
      if (currentScrollRef) {
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    console.log({ page })

    // console.log('home', { selectedDate, tagSelectedList, headLineInputValue })
  }, [page])

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
      <ContentsList contentsList={contentsList} ref={scrollRef} />
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

export default HomeScreen
