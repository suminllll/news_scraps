import React, { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import StarOnIcon from '~/assets/icons/ico_star_on.svg'
import StarOffIcon from '~/assets/icons/ico_star_off.svg'
import { SpaceBetween } from '~/styles/common'
import { useRouter } from 'next/router'

const ContentsList = ({ contentsList, ref }: ContentsList) => {
  const router = useRouter()
  //star list 만들어서 넣고 빼고
  return (
    <>
      <ContentsContainer>
        {contentsList.map((item) => (
          <ContentsBox key={item._ID} onClick={() => router.push(`${item.web_url}`)}>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <ContentsTitle>{item.headLine}</ContentsTitle>
              {item.isStar ? (
                <IconWrapper>
                  <StarOnIcon />
                </IconWrapper>
              ) : (
                <IconWrapper>
                  <StarOffIcon />
                </IconWrapper>
              )}
            </div>
            <ContentsBottomBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <span>{item.source}</span>
                <span>{item.byline}</span>
              </div>
              <p>{item.date}</p>
            </ContentsBottomBox>
          </ContentsBox>
        ))}
        <div ref={ref}></div>
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
