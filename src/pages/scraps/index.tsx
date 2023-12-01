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
import ScrapsBigIcon from '~/assets/icons/ico_scraps_big.svg'
import { useRouter } from 'next/router'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { FilterForm } from '~/types/modal'
import { setScrapFilterModal } from '~/redux/scrapModal'
import { modalStatus } from '~/redux/modalStatus'

const ScrapsScreen = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [innerHeight, setInnerHeight] = useState(0)
  const router = useRouter()
  const dispatch = useDispatch()
  const { selectedDate, tagSelectedList, headLineInputValue } = useSelector(
    (state: RootState) => state.filterScrapModal,
  )
  const { isOpen, modalType } = useSelector((state: RootState) => state.modalStatus)

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
  const filterButtonList = [
    {
      text: '전체 헤드라인전체 헤드라인',
      icon: <SearchIcon fill={modalOpen ? '#82B0F4' : '#6D6D6D'} />,
    },
    {
      text: '전체 날짜',
      icon: <CalenderIcon fill={modalOpen ? '#82B0F4' : '#6D6D6D'} />,
    },
    {
      text: '전체 국가',
      icon: '',
    },
  ]

  const contentsList = [
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: false,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: true,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: false,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: true,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: false,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: false,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: true,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: false,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: true,
    },
    {
      title: '국방부 “北, 화성-17 실패 만회하려 영상 짜깁기… 성공 조작”',
      attached: '조선일보',
      name: '김정확',
      date: '2021.3.15. (목)',
      isStar: false,
    },
  ]

  const onClickButtonHandler = () => {
    dispatch(modalStatus({ modalType: '/scraps', isOpen: true }))
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resizeHandler = () => {
        console.log(window.innerHeight)
        setInnerHeight(window.innerHeight)
      }

      setInnerHeight(window.innerHeight)
      window.addEventListener('resize', resizeHandler)

      return () => {
        window.removeEventListener('resize', resizeHandler)
      }
    }
  }, [])

  const onSubmitHandler = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()

    dispatch(
      setScrapFilterModal({
        selectedDate: form.selectedDate,
        tagSelectedList: form.tagSelectedList,
        headLineInputValue: form.headLineInputValue,
      }),
    )
    onClose()
  }

  const onClose = () => {
    dispatch(modalStatus({ modalType: '/scraps', isOpen: false }))
  }

  useEffect(() => {
    //console.log('scrap', { selectedDate, tagSelectedList, headLineInputValue })
  }, [selectedDate, tagSelectedList, headLineInputValue])
  return (
    <>
      {contentsList.length > 0 && innerHeight > 0 ? (
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
          <ContentsList contentsList={contentsList} />
        </>
      ) : (
        <NotScrapsContainer innerHeight={innerHeight}>
          <ScrapsBigIcon width={27} height={36} />
          <p>저장된 스크랩이 없습니다.</p>
          <SubmitButton type="button" onClick={() => router.push('/')}>
            스크랩 하러 가기
          </SubmitButton>
        </NotScrapsContainer>
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
const NotScrapsContainer = styled.div<{ innerHeight: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: ${({ innerHeight }) => `${innerHeight}px`};
  background-color: #f0f1f4;

  p {
    color: #6d6d6d;
    font-size: 18px;
    font-weight: 600;
    margin: 8px 0 20px;
  }
`

const SubmitButton = styled.button`
  width: 85%;
  height: 60px;
  border-radius: 16px;
  border: none;
  background-color: #3478f6;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`
export default ScrapsScreen
