interface NotValueProps {
  innerHeight?: number
  setInnerHeight?: React.Dispatch<SetStateAction<number>>
  text: string
  btnText?: string
  onClick?: () => void
}

import { useRouter } from 'next/router'
import React, { SetStateAction, useEffect } from 'react'
import { styled } from 'styled-components'
import ScrapsBigIcon from '~/assets/icons/ico_scraps_big.svg'

const NotValue = ({ innerHeight, setInnerHeight, text, btnText, onClick }: NotValueProps) => {
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

  return (
    <NotScrapsContainer innerHeight={innerHeight}>
      <ScrapsBigIcon width={27} height={36} />
      <p>{text}</p>
      {btnText && (
        <SubmitButton type="button" onClick={onClick}>
          {btnText}
        </SubmitButton>
      )}
    </NotScrapsContainer>
  )
}
const NotScrapsContainer = styled.div<{ innerHeight: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: ${({ innerHeight }) => `${innerHeight}px` ?? '100%'};
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
export default NotValue
