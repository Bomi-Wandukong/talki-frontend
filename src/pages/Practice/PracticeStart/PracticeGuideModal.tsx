import { useState } from 'react'
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { IMAGES } from '@/utils/images'

const HIDE_KEY = 'hidePracticeGuideModal'
const SLIDES = [IMAGES.PracticeGuide1, IMAGES.PracticeGuide2, IMAGES.PracticeGuide3, IMAGES.PracticeGuide4]

interface Props {
  onClose: () => void
}

export default function PracticeGuideModal({ onClose }: Props) {
  const [index, setIndex] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) localStorage.setItem(HIDE_KEY, 'true')
    onClose()
  }

  const prev = () => setIndex((i) => Math.max(i - 1, 0))
  const next = () => setIndex((i) => Math.min(i + 1, SLIDES.length - 1))

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[900px] max-w-[90%] rounded-2xl bg-white p-6 shadow-xl">
        {/* X 버튼 */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600 z-10"
        >
          <IoClose size={24} />
        </button>

        {/* 슬라이드 이미지 */}
        <div className="relative flex items-center justify-center pt-8 mt-2">
          <button
            onClick={prev}
            disabled={index === 0}
            className="absolute left-0 rounded-full p-1 text-gray-400 transition hover:text-gray-700 disabled:opacity-20"
          >
            <IoChevronBack size={28} />
          </button>

          <img
            key={index}
            src={SLIDES[index]}
            alt={`연습 가이드 ${index + 1}`}
            className="max-h-[480px] max-w-full rounded-lg object-contain"
          />

          <button
            onClick={next}
            disabled={index === SLIDES.length - 1}
            className="absolute right-0 rounded-full p-1 text-gray-400 transition hover:text-gray-700 disabled:opacity-20"
          >
            <IoChevronForward size={28} />
          </button>
        </div>

        {/* 페이지 인디케이터 */}
        <div className="mt-4 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#5650FF]' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>

        {/* 하단 */}
        <div className="mt-4 flex items-center justify-end">
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

export { HIDE_KEY }
