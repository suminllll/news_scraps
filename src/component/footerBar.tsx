import React from 'react'
import { styled } from 'styled-components'
import { SpaceBetween } from '~/styles/common'
import HomeOnIcon from '~/assets/icons/home_on_ico.svg'
import ScrapsOffIcon from '~/assets/icons/scraps_off_ico.svg'
import HomeOffIcon from '~/assets/icons/home_off_ico.svg'
import ScrapsOnIcon from '~/assets/icons/scraps_on_ico.svg'

const FooterBar = () => {
  return (
    <>
      <FooterContainer>
        <IconBox>
          <HomeOnIcon />
          <p>홈</p>
        </IconBox>
        <IconBox>
          <ScrapsOffIcon />
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

const IconBox = styled.div`
  p {
    color: #ffffff;
    font-size: 10px;
    text-align: center;
  }
`
export default FooterBar
