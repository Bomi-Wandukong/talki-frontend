import React, { useState, useEffect } from 'react'
import api from '@/api/fetchClient'

interface ProfileModalProps {
  onClose: () => void
  onSaved?: (userName: string) => void
}

interface ProfileForm {
  userName: string
  userId: string
  oldPassword: string
  newPassword: string
  email: string
  userType: string
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onSaved }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<ProfileForm>({
    userName: '',
    userId: '',
    oldPassword: '',
    newPassword: '',
    email: '',
    userType: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/profile/get')
        setForm((prev) => ({
          ...prev,
          userName: data.userName ?? '',
          userId: data.userId ?? '',
          email: data.email ?? '',
          userType: data.userType ?? '',
        }))
      } catch (err) {
        console.error('프로필 조회 실패:', err)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      await api.patch('/profile/update', {
        userName: form.userName,
        email: form.email,
      })

      if (form.newPassword) {
        if (!form.oldPassword) {
          alert('기존 비밀번호가 누락되거나 맞지 않습니다.')
          return
        }
        try {
          await api.patch('/profile/password/update', {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          })
        } catch {
          alert('기존 비밀번호가 누락되거나 맞지 않습니다.')
          return
        }
      }

      setForm((prev) => ({ ...prev, oldPassword: '', newPassword: '' }))
      setIsEditing(false)
      onSaved?.(form.userName)
    } catch (err) {
      console.error('프로필 수정 실패:', err)
    }
  }

  const inputClass = `col-span-6 rounded-lg px-4 py-2.5 text-[14px] fontRegular outline-none transition-colors ${
    isEditing
      ? 'bg-white border border-[#D7D6F2] focus:border-[#5650FF]'
      : 'bg-[#F4F4F4] cursor-default text-[#838383]'
  }`

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mb-5 w-[60%] rounded-2xl bg-white px-5 pb-12 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full justify-end pt-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={onClose} className="cursor-pointer">
            <path
              fill="#9D9D9D"
              d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
        </div>

        <div className="px-7">
          <div className="flex">
            <p className="fontSB mr-2 text-xl">내 정보</p>
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
              {isEditing ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mt-0.5">
                  <path
                    fill="#5650FF"
                    d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mt-0.5">
                  <path
                    fill="#9D9D9D"
                    d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-5">
            {/* 닉네임 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">닉네임</span>
              <input
                className={inputClass}
                value={form.userName}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, userName: e.target.value }))}
              />
            </div>

            {/* 아이디 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">아이디</span>
              <input
                className={`col-span-6 rounded-lg px-4 py-2.5 text-[14px] fontRegular outline-none bg-[#F4F4F4] cursor-default text-[#838383]`}
                value={form.userId}
                disabled
              />
            </div>

            {/* 기존 비밀번호 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">기존 비밀번호</span>
              <input
                type="password"
                className={inputClass}
                value={form.oldPassword}
                placeholder={isEditing ? '기존 비밀번호 입력' : '••••••••'}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
              />
            </div>

            {/* 새 비밀번호 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">새 비밀번호</span>
              <input
                type="password"
                className={inputClass}
                value={form.newPassword}
                placeholder={isEditing ? '새 비밀번호 입력' : '••••••••'}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>

            {/* 이메일 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">이메일</span>
              <input
                className={inputClass}
                value={form.email}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* 프로필 사진 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">프로필 사진</span>
              <div className="col-span-6 flex justify-end">
                <div className="h-16 w-16 rounded-lg bg-[#F4F4F4]" />
              </div>
            </div>

            {/* 구독 */}
            <div className="grid grid-cols-10 items-center">
              <span className="fontRegular col-span-4 text-[14px] text-[#3B3B3B]">구독</span>
              <div className="col-span-6 flex justify-end">
                <button className="rounded-xl bg-[#5650FF] px-5 py-2.5 text-[14px] text-white">
                  {form.userType === 'BASIC' ? '구독하기' : '연간 회원권 구독 중'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
