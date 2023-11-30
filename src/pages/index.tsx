import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '~/component/button'
import SearchIcon from '~/assets/icons/ico_search.svg'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import ContentsList from '~/component/contentsList'
import FooterBar from '~/component/footerBar'
import ModalPortal from '~/component/modal/modalConfig'
import FilterModal from '~/component/modal/modal'
import { ButtonContainer } from '~/styles/common'

const HomeScreen = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
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
      text: '전체 헤드라인',
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
    setModalOpen(!modalOpen)
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
      <ContentsList contentsList={contentsList} />
      <FooterBar />
      {modalOpen && (
        <ModalPortal>
          <FilterModal onClose={() => setModalOpen(!modalOpen)} />
        </ModalPortal>
      )}
    </>
  )
}

const Headers = styled.header`
  height: 60px;
  width: 100%;
  padding: 13px 20px;
`

export default HomeScreen
