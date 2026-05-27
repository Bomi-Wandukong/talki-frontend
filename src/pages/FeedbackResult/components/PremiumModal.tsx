import React, { useState } from 'react'

interface PremiumModalProps {
  onClose: () => void
  onStartFreeTrial: () => Promise<void>
}

export default function PremiumModal({ onClose, onStartFreeTrial }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual')
  const [isLoading, setIsLoading] = useState(false)

  const handleFreeTrial = async () => {
    setIsLoading(true)
    try {
      await onStartFreeTrial()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pb-6 pt-10 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2 className="text-[22px] font-bold leading-snug text-gray-900">
            7일 무료 체험으로
            <br />
            시작해보세요
          </h2>
          <p className="mt-2 text-[14px] text-gray-500">무료체험 중에는 결제되지 않아요.</p>
        </div>

        {/* Plans */}
        <div className="space-y-3 px-8 pb-6">
          {/* Annual plan */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-5 py-4 transition-all ${
              selectedPlan === 'annual'
                ? 'border-[#5650FF] bg-[#EEEEFF]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selectedPlan === 'annual' ? 'border-[#5650FF]' : 'border-gray-300'
                }`}
              >
                {selectedPlan === 'annual' && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />
                )}
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">연간</p>
                <p className="text-[12px] text-gray-500">7일 무료 / 1년마다 결제</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[16px] font-bold text-gray-900">33,000</p>
              <p className="text-[12px] text-gray-500">세부 분석 기능 사용 가능</p>
            </div>
          </div>

          {/* Monthly plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-5 py-4 transition-all ${
              selectedPlan === 'monthly'
                ? 'border-[#5650FF] bg-[#EEEEFF]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selectedPlan === 'monthly' ? 'border-[#5650FF]' : 'border-gray-300'
                }`}
              >
                {selectedPlan === 'monthly' && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#5650FF]" />
                )}
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">월간</p>
                <p className="text-[12px] text-gray-500">1개월마다 결제</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[16px] font-bold text-gray-900">3,900</p>
              <p className="text-[12px] text-gray-500">세부 분석 기능 사용 가능</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="border-t border-gray-100 px-8 py-6">
          <button
            onClick={handleFreeTrial}
            disabled={isLoading}
            className="w-full rounded-xl bg-[#5650FF] py-4 text-[16px] font-bold text-white transition-all hover:bg-[#4540CC] disabled:opacity-60"
          >
            {isLoading ? '처리 중...' : '무료 체험 시작하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
