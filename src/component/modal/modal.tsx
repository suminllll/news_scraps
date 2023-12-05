interface ModalProps {
  onClose: () => void
  form: FilterForm
  setForm: React.Dispatch<SetStateAction<FilterForm>>
  onSubmitHandler: (e: React.FormEvent<HTMLDivElement>) => void
}

import { styled } from 'styled-components'
import Button from '../button'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import CalenderIcon from '~/assets/icons/ico_calender.svg'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ButtonContainer } from '~/styles/common'
import { FilterForm } from '~/types/modal'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '~/redux/store'
import ModalPortal from './modalConfig'

const FilterModal = ({ onClose, form, setForm, onSubmitHandler }: ModalProps) => {
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const { selectedDate, tagSelectedList, headLineInputValue } = form
  const { isOpen, modalType } = useSelector((state: RootState) => state.modalStatus)
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
    { text: '대한민국', value: 'Korea' },
    { text: '중국', value: 'China' },
    { text: '일본', value: 'Japan' },
    { text: '미국', value: 'USA' },
    { text: '북한', value: 'North Korea' },
    { text: '러시아', value: 'Russia' },
    { text: '프랑스', value: 'France' },
    { text: '영국', value: 'Great Britain' },
  ]

  const onClickBackground = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backgroundRef.current) {
      onClose()
    }
  }

  const tagHandler = (text: string, value: string) => {
    if (tagSelectedList.find((tag) => tag.value === value)) {
      setForm({
        ...form,
        tagSelectedList: tagSelectedList.filter((item) => item.value !== value),
      })
      return
    }

    setForm({
      ...form,
      tagSelectedList: [...tagSelectedList, { text, value }],
    })
  }

  const headLineInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const onlyString = value.replace(/[^0-9]/g, '')

    if (onlyString !== '') {
      alert('문자만 입력 가능해요.')
      return
    }

    setForm({
      ...form,
      headLineInputValue: value,
    })
  }

  return (
    <>
      {isOpen && modalType === router.pathname && (
        <ModalPortal>
          <BackModalContainer
            ref={backgroundRef}
            onClick={onClickBackground}
            onSubmit={onSubmitHandler}
          >
            <ModalWrapper>
              <InputContainer>
                <h3>헤드라인</h3>
                <input
                  className="filterInput"
                  placeholder="검색하실 헤드라인을 입력해주세요."
                  onChange={(e) => headLineInputHandler(e)}
                  type="text"
                  value={headLineInputValue}
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
                      key={item.value}
                      buttonStyle={
                        tagSelectedList.find((tag) => tag.value === item.value)
                          ? selectTagColor
                          : normalTagColor
                      }
                      onClick={tagHandler}
                    />
                  ))}
                </ButtonContainer>
              </InputContainer>
              <SubmitButton type="submit">필터 적용하기</SubmitButton>
            </ModalWrapper>
          </BackModalContainer>
        </ModalPortal>
      )}
    </>
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
