interface ButtonList {
  item: {
    text: string | null
    icon?: React.ReactNode
    value?: string
  }
  onClick: (text: string, value: string) => void
  buttonStyle: {
    color: string
    backColor: string
    borderColor: string
  }
}

import { styled } from 'styled-components'

const Button = ({ item, onClick, buttonStyle }: ButtonList) => {
  return (
    <>
      <ButtonWrapper
        onClick={() => onClick(item.text !== null ? item.text : '', item.value ? item.value : '')}
        buttonstyle={buttonStyle}
        type="button"
      >
        {item.icon && <IconWrapper>{item.icon ? item.icon : ''}</IconWrapper>}
        <span> {item.text}</span>
      </ButtonWrapper>
    </>
  )
}

const ButtonWrapper = styled.button<{ buttonstyle: ButtonList['buttonStyle'] }>`
  display: flex;
  color: ${({ buttonstyle }) => buttonstyle.color};
  background-color: ${({ buttonstyle }) => buttonstyle.backColor};
  height: 34px;
  padding: 8px 11px 6px 11px;
  border-radius: 30px;
  border: ${({ buttonstyle }) => buttonstyle.borderColor && `1px solid ${buttonstyle.borderColor}`};
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
