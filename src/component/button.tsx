interface ButtonList {
  item: { text: string; icon?: React.ReactNode; value?: string }
  onClick: (value: string) => void
  buttonStyle: {
    color: string
    backColor: string
    borderColor: string
  }
}

import React, { useState } from 'react'
import { styled } from 'styled-components'

const Button = ({ item, onClick, buttonStyle }: ButtonList) => {
  return (
    <>
      <ButtonWrapper onClick={() => onClick(item.text)} buttonStyle={buttonStyle} type="button">
        {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
        <span> {item.text}</span>
      </ButtonWrapper>
    </>
  )
}

const ButtonWrapper = styled.button<{ buttonStyle: ButtonList['buttonStyle'] }>`
  display: flex;
  color: ${({ buttonStyle }) => buttonStyle.color};
  background-color: ${({ buttonStyle }) => buttonStyle.backColor};
  height: 34px;
  padding: 8px 11px 6px 11px;
  border-radius: 30px;
  border: ${({ buttonStyle }) => buttonStyle.borderColor && `1px solid ${buttonStyle.borderColor}`};
  max-width: 117px;

  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 117px;
  }
`

const IconWrapper = styled.div`
  margin-top: 1px;
  margin-right: 4px;
`
export default Button
