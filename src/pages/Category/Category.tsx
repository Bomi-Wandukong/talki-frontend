import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'

const Category = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<'presentation' | 'interview' | null>(null)
  const [subCategory, setSubCategory] = useState('')
  const [topic, setTopic] = useState('')

  const [isUnexpectedEvent, setIsUnexpectedEvent] = useState(false)
  const [isRealtimeFeedback, setIsRealtimeFeedback] = useState(false)

  const handleComplete = () => {
    navigate('/actual/guideline')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] pb-20 pt-[100px]">
      <Nav />

      <div className="mx-auto flex w-[1000px] flex-col items-center pt-20">
        <div className="mb-10 w-full">
          <h1 className="text-[28px] font-bold text-[#3B3B3B]">
            어떤 <span className="text-[#5650FF]">실전</span>을 준비하고 있나요?
          </h1>
          <p className="mt-2 text-[#716FA4]">
            시작하기 전, 보다 정확한 검사를 위해 상황을 정해 주세요!
          </p>

          <div className="mt-8 flex gap-3">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-[6px] flex-1 rounded-full transition-colors ${
                  step >= num ? 'bg-[#FF9B50]' : 'bg-[#E5E5EC]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          {/* STEP 1 */}
          <section className="flex w-full rounded-2xl bg-white p-10 shadow-sm transition-all">
            <div
              className={`fontBold mr-20 w-[10%] text-[22px] ${step > 1 ? 'text-[#c3c3ca]' : 'text-[#5650FF]'}`}
            >
              STEP 1
            </div>
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <span
                  className={`fontSB text-[17px] ${step > 1 ? 'text-[#c3c3ca]' : 'text-[#3B3B3B]'}`}
                >
                  원하는{' '}
                  <span className={step > 1 ? 'text-[#c3c3ca]' : 'text-[#5650FF]'}>카테고리</span>를
                  선택해 주세요.
                </span>

                {step > 1 ? (
                  <button
                    onClick={() => {
                      setStep(1)
                      setSubCategory('')
                      setTopic('')
                    }}
                    className="h-12 w-28 rounded-xl bg-[#c3c3ca] text-[17px] text-white"
                  >
                    다시하기
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCategory('presentation')}
                      className={`rounded-lg border px-8 py-2 text-[15px] transition-all ${
                        category === 'presentation'
                          ? 'bg-[#5650FF] text-white'
                          : 'border-[#E5E5EC] text-[#ACA9FE]'
                      }`}
                    >
                      발표
                    </button>
                    <button
                      className="cursor-not-allowed rounded-lg border border-[#E5E5EC] px-8 py-2 text-[15px] text-[#E5E5EC]"
                      title="준비 중인 기능입니다."
                    >
                      면접
                    </button>
                  </div>
                )}
              </div>

              {category === 'presentation' && step === 1 && (
                <div>
                  <div className="mt-10 flex w-full justify-between pt-5">
                    <p className="fontSB mb-6 text-[16px] text-[#3B3B3B]">
                      <span className="text-[#5650FF]">어떤 발표</span> 인가요?
                    </p>
                    <div className="grid w-[70%] grid-cols-2 gap-y-6">
                      {['화상 발표', '강당 발표', '소규모 발표', '강의실 발표'].map((item) => (
                        <label key={item} className="group flex cursor-pointer items-center gap-3">
                          <input
                            type="radio"
                            name="sub"
                            checked={subCategory === item}
                            onChange={() => setSubCategory(item)}
                            className="h-5 w-5 accent-[#5650FF]"
                          />
                          <span
                            className={`text-[#716FA4] group-hover:text-[#5650FF] ${subCategory === item ? 'font-bold text-[#5650FF]' : ''}`}
                          >
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!subCategory}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5650FF] text-white disabled:bg-[#ACA9FE]"
                    >
                      <span className="text-xl">✓</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* STEP 2 */}
          <section
            className={`flex w-full rounded-2xl bg-white p-10 shadow-sm transition-opacity ${
              step < 2 ? 'pointer-events-none opacity-50' : 'opacity-100'
            }`}
          >
            <div
              className={`fontBold mr-20 w-[10%] text-[22px] ${step > 2 ? 'text-[#c3c3ca]' : 'text-[#5650FF]'}`}
            >
              STEP 2
            </div>
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <span
                  className={`fontSB text-[17px] ${step > 2 ? 'text-[#c3c3ca]' : 'text-[#3B3B3B]'}`}
                >
                  발표 <span className={step > 2 ? 'text-[#c3c3ca]' : 'text-[#5650FF]'}>주제</span>
                  를 작성해 주세요.
                </span>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="h-12 w-28 rounded-xl bg-[#c3c3ca] text-[17px] text-white"
                  >
                    다시하기
                  </button>
                )}
              </div>

              {step === 2 && (
                <div className="mt-8 w-full">
                  <input
                    type="text"
                    placeholder="주제를 입력해 주세요"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border-b-2 border-[#E5E5EC] py-3 text-[18px] outline-none focus:border-[#5650FF]"
                  />
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setStep(3)}
                      disabled={!topic}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5650FF] text-white disabled:bg-[#ACA9FE]"
                    >
                      <span className="text-xl">✓</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* STEP 3 */}
          <section
            className={`flex w-full rounded-2xl bg-white p-10 shadow-sm transition-opacity ${
              step < 3 ? 'pointer-events-none opacity-50' : 'opacity-100'
            }`}
          >
            <div
              className={`fontBold mr-20 w-[10%] text-[22px] ${step > 2 ? 'text-[#c3c3ca]' : 'text-[#5650FF]'}`}
            >
              STEP 3
            </div>
            <div className="flex w-full">
              <div className="flex w-[40%]">
                <span
                  className={`fontSB text-[17px] ${step === 3 ? 'text-[#3B3B3B]' : 'text-[#E5E5EC]'}`}
                >
                  <span className={step === 3 ? 'text-[#5650FF]' : ''}>옵션</span>을 선택해 주세요.
                </span>
              </div>
              {step === 3 && (
                <div className="flex w-full flex-col gap-6">
                  <div className="border-l-2 border-[#D7D6F1] pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="fontBold text-[17px] text-[#5650FF]">돌발 상황 발생</p>
                        <p className="text-[14px] text-[#716FA4]">
                          돌발 질문, 기침소리 등을 추가해 실제 상황을 연출합니다.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsUnexpectedEvent(!isUnexpectedEvent)}
                        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${isUnexpectedEvent ? 'bg-[#5650FF]' : 'bg-[#E5E5EC]'}`}
                      >
                        <div
                          className={`absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            isUnexpectedEvent ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="fontBold text-[17px] text-[#5650FF]">실시간 피드백</p>
                        <p className="text-[14px] text-[#716FA4]">
                          발표 중 내 음성과 제스처에 대한 실시간 피드백을 제공합니다.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsRealtimeFeedback(!isRealtimeFeedback)}
                        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${isRealtimeFeedback ? 'bg-[#5650FF]' : 'bg-[#E5E5EC]'}`}
                      >
                        <div
                          className={`absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            isRealtimeFeedback ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleComplete}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5650FF] text-white disabled:bg-[#ACA9FE]"
                    >
                      <span className="text-xl">✓</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Category
