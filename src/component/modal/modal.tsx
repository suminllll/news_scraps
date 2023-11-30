interface ModalProps {
  onClose: () => void
}

type Form = {
  selectedDate: null | Date
  tagSelectedList: string[]
  headLineInputValue: string
}
import { styled } from 'styled-components'
import Button from '../button'
import { useEffect, useRef, useState } from 'react'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { setCookie } from '~/utils/cookies'
import { ButtonContainer } from '~/styles/common'

const FilterModal = ({ onClose }: ModalProps) => {
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const [form, setForm] = useState<Form>({
    selectedDate: null,
    tagSelectedList: [],
    headLineInputValue: '',
  })

  const { selectedDate, tagSelectedList, headLineInputValue } = form

  const selectTagColor = {
    color: '#ffffff',
    backColor: '#82B0F4',
    borderColor: '#F2F2F2',
  }
  const normalTagColor = {
    color: '',
    backColor: '#ffffff',
    borderColor: '#F2F2F2',
  }
  const tagList = [
    { text: '대한민국' },
    { text: '중국' },
    { text: '일본' },
    { text: '미국' },
    { text: '북한' },
    { text: '러시아' },
    { text: '프랑스' },
    { text: '영국' },
    { text: '북한' },
  ]

  const onClickBackground = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backgroundRef.current) {
      onClose()
    }
  }

  const tagHandler = (value: string) => {
    if (tagSelectedList.includes(value)) {
      setForm({
        ...form,
        tagSelectedList: tagSelectedList.filter((item) => item !== value),
      })
      return
    }
    setForm({
      ...form,
      tagSelectedList: [...tagSelectedList, value],
    })
  }

  const headLineInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      headLineInputValue: e.target.value,
    })
  }

  const onsubmitHandler = (e) => {
    e.preventDefault()

    onClose()
  }
  useEffect(() => {
    console.log({ form })
  }, [form])

  return (
    <BackModalContainer ref={backgroundRef} onClick={onClickBackground} onSubmit={onsubmitHandler}>
      <ModalWrapper>
        <InputContainer>
          <h3>헤드라인</h3>
          <input
            className="filterInput"
            placeholder="검색하실 헤드라인을 입력해주세요."
            onChange={(e) => headLineInputHandler(e)}
          />
        </InputContainer>
        <InputContainer>
          <h3>날짜</h3>
          <DatePicker
            name="selectedDate"
            className="filterInput"
            placeholderText="날짜를 선택해주세요."
            dateFormat="yyyy.MM.dd"
            showIcon
            icon={
              <div style={{ position: 'absolute', right: 20, top: 6 }}>
                <CalenderIcon fill="#6D6D6D" />
              </div>
            }
            minDate={new Date()}
            selected={selectedDate}
            onChange={(date) => setForm({ ...form, selectedDate: date })}
          />
        </InputContainer>
        <InputContainer>
          <h3>국가</h3>
          <ButtonContainer>
            {tagList.map((item) => (
              <Button
                item={item}
                key={item.text}
                buttonStyle={tagSelectedList.includes(item.text) ? selectTagColor : normalTagColor}
                onClick={tagHandler}
              />
            ))}
          </ButtonContainer>
        </InputContainer>
        <SubmitButton type="submit">필터 적용하기</SubmitButton>
      </ModalWrapper>
    </BackModalContainer>
  )
}

const BackModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 560px;
  height: 100%;
  z-index: 99;
  background-color: #3f3f3fac;
`

const ModalWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 85%;
  height: 480px;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
`

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 40px;
  position: relative;

  h3 {
    font-weight: 600;
    font-size: 16px;
    margin: 0 0 8px 0;
  }

  .filterInput {
    width: 100%;
    height: 44px;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #c4c4c4;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }
`
const SubmitButton = styled.button`
  position: absolute;
  bottom: 20px;
  width: 85%;
  height: 60px;
  border-radius: 16px;
  border: none;
  background-color: #3478f6;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`
export default FilterModal
