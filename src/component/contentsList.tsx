import React, { useEffect, useLayoutEffect, useState } from 'react'
import { styled } from 'styled-components'
import StarOnIcon from '~/assets/icons/ico_star_on.svg'
import StarOffIcon from '~/assets/icons/ico_star_off.svg'
import { SpaceBetween } from '~/styles/common'
import { useRouter } from 'next/router'
import NotValue from './notValue'
import { setCookie } from '~/utils/cookies'
import moment from 'moment'
import { RootState } from '~/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { Scraps, scrapStatus } from '~/redux/scraps'
import { getCookieHandler } from '~/utils/common'

const ContentsList = ({ contentsList, isFilter }: ContentsListProps) => {
  const [innerHeight, setInnerHeight] = useState(0)
  const { scrapList }: Scraps = useSelector((state: RootState) => state.scrapStatus)
  const router = useRouter()
  const dispatch = useDispatch()
  const expires = moment().add(1, 'months').toDate()

  const onClickStar = (id: string) => {
    let updatedList = [...scrapList]

    if (scrapList.includes(id)) {
      updatedList = updatedList.filter((item) => item !== id)
      alert('스크랩이 해제 되었어요.')
    } else {
      updatedList.push(id)
      alert('스크랩 되었어요.')
    }

    dispatch(scrapStatus({ scrapList: updatedList }))
    setCookie('scraps_list', JSON.stringify(updatedList), {
      expires,
      path: '/',
    })
  }

  useLayoutEffect(() => {
    getCookieHandler(dispatch)
  }, [])

  useEffect(() => {
    //console.log('scraps_list', { scrapList })
    // console.log({ contentsList })
  }, [scrapList, contentsList])
  return (
    <>
      <ContentsContainer>
        {contentsList.map((item) => (
          <ContentsBox key={item._id}>
            <ContentsTitleBox>
              <ContentsTitle onClick={() => router.push(`${item.web_url}`)}>
                {item.headline}
              </ContentsTitle>

              <IconWrapper onClick={() => onClickStar(item._id)}>
                {scrapList.includes(item._id) ? <StarOnIcon /> : <StarOffIcon />}
              </IconWrapper>
            </ContentsTitleBox>
            <ContentsBottomBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <span>{item.source}</span>
                <span>{item.byline}</span>
              </div>
              <p>{item.date}</p>
            </ContentsBottomBox>
          </ContentsBox>
        ))}
        {contentsList.length < 1 && isFilter && (
          <NotValue
            innerHeight={innerHeight}
            setInnerHeight={setInnerHeight}
            text="적용된 필터 내용이 없습니다."
            btnText="돌아가기"
            onClick={() => router.reload()}
          />
        )}
      </ContentsContainer>
    </>
  )
}

const ContentsContainer = styled.div`
  padding: 20px;
  background-color: #f0f1f4;
  margin-bottom: 85px;
`

const ContentsBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 100%;
  height: 104px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 8px;
`

const ContentsTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8%;
  overflow: hidden;
`

const ContentsTitle = styled.p`
  width: 90%;
  height: 56px;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  margin: 0 11px 0 0;
`

const IconWrapper = styled.div`
  margin-top: 7px;
  width: 24px;
  position: absolute;
  right: 20px;
  top: 10px;
`

const ContentsBottomBox = styled.div`
  ${SpaceBetween};

  div > span {
    font-size: 13px;
    line-height: 20px;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-size: 13px;
    color: #6d6d6d;
    line-height: 20px;
    margin: 0;
  }
`
export default ContentsList
