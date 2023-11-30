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
