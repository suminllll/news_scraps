import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { SpaceBetween } from '~/styles/common'
import HomeIcon from '~/assets/icons/ico_home.svg'
import ScrapsOnIcon from '~/assets/icons/ico_scraps_on.svg'
import ScrapsOffIcon from '~/assets/icons/ico_scraps_off.svg'
import { useRouter } from 'next/router'

const FooterBar = () => {
  const [isHome, setIsHome] = useState(true)
  const router = useRouter()

  const pageToggleHandler = (value: string) => {
    if (value === '홈') {
      router.push('/')
      setIsHome(true)
      return
    }

    router.push('/scraps')
    setIsHome(false)
  }

  useEffect(() => {
    if (router.pathname === '/scraps') {
      setIsHome(false)
      return
    }
    setIsHome(true)
  }, [router])

  return (
    <>
      <FooterContainer>
        <IconBox onClick={() => pageToggleHandler('홈')} isHome={isHome}>
          <HomeIcon fill={isHome ? '#ffffff' : '#6D6D6D'} />
          <p>홈</p>
        </IconBox>
        <IconBox onClick={() => pageToggleHandler('스크랩')} isHome={!isHome}>
          {!isHome ? <ScrapsOnIcon /> : <ScrapsOffIcon />}
          <p>스크랩</p>
        </IconBox>
      </FooterContainer>
    </>
  )
}

const FooterContainer = styled.footer`
  ${SpaceBetween}
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 85px;
  padding: 20px 80px;
  border-radius: 30px;
  background-color: #000000;
  z-index: 999;
`

const IconBox = styled.div<{ isHome: boolean }>`
  p {
    color: ${({ isHome }) => (isHome ? '#ffffff' : '#6D6D6D')};
    font-size: 10px;
    font-weight: 600;
    line-height: 12px;
    text-align: center;
  }
`
export default FooterBar
