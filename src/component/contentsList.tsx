import React from 'react'
import { styled } from 'styled-components'
import StarOnIcon from '~/assets/icons/ico_star_on.svg'
import StarOffIcon from '~/assets/icons/ico_star_off.svg'
import { SpaceBetween } from '~/styles/common'

const ContentsList = ({ contentsList }: ContentsList) => {
  return (
    <>
      <ContentsContainer>
        {contentsList.map((item) => (
          <ContentsBox key={item.title}>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <ContentsTitle>{item.title}</ContentsTitle>
              <IconWrapper>{item.isStar ? <StarOnIcon /> : <StarOffIcon />}</IconWrapper>
            </div>
            <ContentsBottomBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <span>{item.attached}</span>
                <span>{item.name} 기자</span>
              </div>
              <p>{item.date}</p>
            </ContentsBottomBox>
          </ContentsBox>
        ))}
      </ContentsContainer>
    </>
  )
}

const ContentsContainer = styled.div`
  padding: 20px;
  background-color: #f0f1f4;
`
const ContentsBox = styled.div`
  width: 100%;
  height: 104px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 8px;
`

const ContentsTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  margin: 0 11px 0 0;
`

const IconWrapper = styled.div`
  margin-top: 7px;
  width: 24px;
`

const ContentsBottomBox = styled.div`
  ${SpaceBetween};

  div > span {
    font-size: 13px;
    line-height: 20px;
  }

  p {
    font-size: 13px;
    color: #6d6d6d;
    line-height: 20px;
    margin: 0;
  }
`
export default ContentsList
