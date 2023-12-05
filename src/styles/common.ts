import { css, styled } from 'styled-components'

export const SpaceBetween = css`
  display: flex;
  justify-content: space-between;
`

export const Flex = css`
  display: flex;
`

export const SpaceBetweenDiv = styled.div`
  ${SpaceBetween}
`

export const FlexDiv = styled.div`
  ${Flex}
`
export const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`

export const activeFilterColor = {
  color: '#82B0F4',
  borderColor: '#82B0F4',
  backColor: '#ffffff',
}

export const normalFilterColor = {
  color: '#6D6D6D',
  borderColor: '#c4c4c4',
  backColor: '#ffffff',
}

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -70px;
  margin-bottom: 110px;
`
