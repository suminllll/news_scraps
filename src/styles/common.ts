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

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -70px;
  margin-bottom: 110px;
`

export const Headers = styled.header`
  height: 60px;
  width: 100%;
  padding: 13px 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #ffffff;
`
