import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

interface TutorialModalProps {
  onClose: () => void
}

const TUTORIAL_HIDE_KEY = 'hideLiveTutorial'

export default function TutorialModal({ onClose }: TutorialModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(TUTORIAL_HIDE_KEY, 'true')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[900px] max-w-[90%] rounded-2xl bg-white p-6 shadow-none">
        {/* X 버튼 */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <IoClose size={24} />
        </button>

        {/* 콘텐츠 영역 */}
        <div className="flex items-center justify-center pt-10">
          <img
            src="/img/liveFeedbackTutorial.png"
            alt="튜토리얼 이미지"
            className="max-h-full max-w-full"
          />
        </div>

        {/* 하단 영역 */}
        <div className="mt-2 flex items-center justify-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            다시 보지 않기
          </label>
        </div>
      </div>
    </div>
  )
}
