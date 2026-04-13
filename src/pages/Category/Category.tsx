import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav/Nav'

const Category = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [presentationType, setPresentationType] = useState('화상 발표')
  const [topic_summary, setTopic_summary] = useState('')
  const [topic_desc, setTopic_desc] = useState('')
  const [hashInput, setHashInput] = useState('')

  const [isUnexpectedEvent, setIsUnexpectedEvent] = useState(false)
  const [isRealtimeFeedback, setIsRealtimeFeedback] = useState(false)

  const getMappedType = (type:string) => {
    const mapping = {
      '화상 발표': 'online_small',
      '소규모 발표': 'small',
      '강당 발표': 'large',
      '강의실 발표': 'large',
    }as const;
    return mapping[type as keyof typeof mapping] || 'online_small';
  }

  const handleComplete = () => {
    const topic_tags = hashInput
      .trim()
      .split(/\s+/)
      .filter((v) => v.startsWith('#') && v.length > 1)
    navigate('/actual/guideline', {
      state: {
        presentationType: getMappedType(presentationType),
        originalType: presentationType,
        topic_summary,
        topic_desc,
        topic_tags,
        isUnexpectedEvent,
        isRealtimeFeedback,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] pb-20 pt-[100px]">
      <Nav />

      <div className="mx-auto flex w-[75%] flex-col items-center pt-20">
        <div className="mb-10 w-full">
          <h1 className="text-[24px] font-bold text-[#3B3B3B]">
            어떤 <span className="text-[#5650FF]">실전</span>을 준비하고 있나요?
          </h1>
          <p className="mt-2 text-[15px] text-[#716FA4]">
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
              className={`fontBold mr-20 w-[10%] pt-1 text-[22px] transition-colors ${step > 1 ? 'text-[#868686]' : 'text-[#5650FF]'}`}
            >
              STEP 1
            </div>
            <div className="flex w-full flex-col justify-between">
              <div
                className={`flex w-full justify-between ${step > 1 ? 'pointer-events-none' : ''}`}
              >
                <p
                  className={`fontSB text-[16px] transition-colors ${step > 1 ? 'text-[#868686]' : 'text-[#3B3B3B]'}`}
                >
                  <span className={step > 1 ? 'text-[#868686]' : 'text-[#5650FF]'}>어떤 발표</span>{' '}
                  인가요?
                </p>
                <div className="fontRegular grid w-[70%] grid-cols-2 gap-y-6">
                  {['화상 발표', '강당 발표', '소규모 발표', '강의실 발표'].map((item) => (
                    <label key={item} className="group flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="sub"
                        checked={presentationType === item}
                        onChange={() => setPresentationType(item)}
                        className={`h-5 w-5 transition-all ${step > 1 ? 'accent-[#868686] opacity-50' : 'accent-[#5650FF]'}`}
                      />
                      <span
                        className={`transition-colors ${
                          presentationType === item
                            ? `fontRegular ${step > 1 ? 'text-[#868686]' : 'text-[#5650FF]'}`
                            : step > 1
                              ? 'text-[#D1D1D1]'
                              : 'text-[#716FA4]'
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 하단 버튼 영역 */}
              {step === 1 ? (
                <div className="mt-8 flex h-12 justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!setPresentationType}
                    className="animate-in zoom-in-95 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5650FF] text-white transition-all duration-200 disabled:bg-[#ACA9FE]"
                  >
                    <span className="mb-1 text-3xl">✓</span>
                  </button>
                </div>
              ) : (
                <div className="mt-8 flex h-12 justify-end">
                  <button
                    onClick={() => setStep(1)}
                    className="flex h-12 w-28 items-center justify-center overflow-hidden rounded-xl bg-[#868686] text-white transition-all duration-300 hover:bg-[#707070]"
                  >
                    <span className="whitespace-nowrap text-[17px] transition-opacity duration-200">
                      다시하기
                    </span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* STEP 2 */}
          {step >= 2 && (
            <section className="animate-in fade-in slide-in-from-top-5 flex w-full rounded-2xl bg-white p-10 shadow-sm duration-500">
              <div
                className={`fontBold mr-20 w-[10%] text-[22px] transition-colors ${step > 2 ? 'text-[#868686]' : 'text-[#5650FF]'}`}
              >
                STEP 2
              </div>
              <div className="flex w-full flex-col pt-1">
                <div className="flex items-center">
                  <span
                    className={`fontSB text-[17px] transition-colors ${step > 2 ? 'text-[#868686]' : 'text-[#3B3B3B]'}`}
                  >
                    발표{' '}
                    <span className={step > 2 ? 'text-[#868686]' : 'text-[#5650FF]'}>주제</span>를
                    작성해 주세요.
                  </span>
                </div>

                {/* 입력 영역 */}
                <div
                  className={`mt-10 flex w-full gap-10 transition-all ${step > 2 ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <div className="flex flex-1 flex-col gap-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-l-2 border-[#D7D6F1] pl-3">
                        <span className="fontSB text-[15px] text-[#3B3B3B]">주제 요약</span>
                        <span className="text-[12px] text-[#AEAEB2]">
                          {topic_summary.length}/50
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="발표 주제를 한 줄로 요약해 주세요"
                        value={topic_summary}
                        onChange={(e) => setTopic_summary(e.target.value.slice(0, 50))}
                        className="w-full rounded-xl border border-[#E5E5EC] p-4 text-[15px] outline-none focus:border-[#5650FF]"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-l-2 border-[#D7D6F1] pl-3">
                        <span className="fontSB text-[15px] text-[#3B3B3B]">해시태그</span>
                        <span
                          className={`text-[12px] ${
                            hashInput
                              .trim()
                              .split(/\s+/)
                              .filter((v) => v.startsWith('#') && v.length > 1).length > 3
                              ? 'text-red-500'
                              : 'text-[#AEAEB2]'
                          }`}
                        >
                          최대{' '}
                          {hashInput.trim() === ''
                            ? 0
                            : hashInput
                                .split(/\s+/)
                                .filter((v) => v.startsWith('#') && v.length > 1).length}{' '}
                          / 3개
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="스페이스바로 해시태그를 구분해 주세요"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E5EC] p-4 text-[15px] outline-none focus:border-[#5650FF]"
                      />
                    </div>
                  </div>

                  {/* 오른쪽 섹션: 주제 설명 */}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center justify-between border-l-2 border-[#D7D6F1] pl-3">
                      <span className="fontSB text-[15px] text-[#3B3B3B]">주제 설명</span>
                      <span className="text-[12px] text-[#AEAEB2]">{topic_desc.length}/200</span>
                    </div>
                    <textarea
                      placeholder="발표에 대한 상세 내용을 작성해 주세요"
                      value={topic_desc}
                      onChange={(e) => setTopic_desc(e.target.value.slice(0, 200))}
                      className="h-[188px] w-full resize-none rounded-xl border border-[#E5E5EC] p-4 text-[15px] outline-none focus:border-[#5650FF]"
                    />
                  </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="mt-8 flex h-12 justify-end">
                  {step === 2 ? (
                    <button
                      onClick={() => setStep(3)}
                      disabled={
                        !topic_summary ||
                        !topic_desc ||
                        hashInput.split(/\s+/).filter((v) => v.startsWith('#') && v.length > 1)
                          .length < 1
                      }
                      className="animate-in zoom-in-95 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5650FF] text-white transition-all duration-200 disabled:bg-[#ACA9FE]"
                    >
                      <span className="mb-1 text-3xl">✓</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(2)}
                      className="flex h-12 w-28 items-center justify-center overflow-hidden rounded-xl bg-[#868686] text-white transition-all duration-300 hover:bg-[#707070]"
                    >
                      <span className="whitespace-nowrap text-[17px] transition-opacity duration-200">
                        다시하기
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step >= 3 && (
            <section className="animate-in fade-in slide-in-from-top-5 flex w-full rounded-2xl bg-white p-10 shadow-sm duration-500">
              <div className="fontBold mr-20 w-[10%] text-[22px] text-[#5650FF]">STEP 3</div>
              <div className="flex w-full flex-col pt-1">
                <div className="flex w-full">
                  <div className="flex w-[40%]">
                    <span className="fontSB text-[17px] text-[#3B3B3B]">
                      <span className="text-[#5650FF]">옵션</span>을 선택해 주세요.
                    </span>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="mb-4 mr-8 h-[90%] w-[2px] bg-[#D7D6F1]"></div>
                    <div className="flex w-full flex-col gap-6">
                      {/*돌발상황 발생*/}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="fontBold text-[17px] text-[#5650FF]">돌발 상황 발생</p>
                          <p className="text-[14px] text-[#716FA4]">
                            돌발 질문, 기침소리 등을 추가해 실제 상황을 연출합니다.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsUnexpectedEvent(!isUnexpectedEvent)}
                          className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${isUnexpectedEvent ? 'bg-[#5650FF]' : 'bg-[#E5E5EC]'}`}
                        >
                          <div
                            className={`absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isUnexpectedEvent ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>

                      {/*실시간 피드백*/}
                      <div className="my-4 flex items-center justify-between">
                        <div>
                          <p className="fontBold text-[17px] text-[#5650FF]">실시간 피드백</p>
                          <p className="text-[14px] text-[#716FA4]">
                            발표 중 내 음성과 제스처에 대한 실시간 피드백을 제공합니다.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsRealtimeFeedback(!isRealtimeFeedback)}
                          className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${isRealtimeFeedback ? 'bg-[#5650FF]' : 'bg-[#E5E5EC]'}`}
                        >
                          <div
                            className={`absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isRealtimeFeedback ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleComplete}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5650FF] text-white transition-all hover:bg-[#433bff]"
                  >
                    <span className="mb-1 text-3xl">✓</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default Category
