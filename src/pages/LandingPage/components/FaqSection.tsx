import { useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: '어떻게 시작하나요?',
    answer:
      "먼저 회원가입 후 로그인을 해주세요. 상단의 '실전 시작하기' 버튼을 눌러 원하는 상황을 선택하면 바로 연습을 시작할 수 있습니다.",
  },
  {
    question: '계정에 로그인할 수 없어요. 어떻게 해야 하나요?',
    answer:
      '비밀번호 찾기 기능을 이용하시거나, 가입하신 이메일 형식이 맞는지 확인해주세요. 지속적인 문제가 발생하면 고객센터로 문의 부탁드립니다.',
  },
  {
    question: '저장된 영상과 결과는 나만 확인할 수 있나요?',
    answer: '당연하죠. 토키를 이용하며 저장된 영상과 피드백들은 본인만 확인이 가능합니다.',
  },
  {
    question: '추가적인 질문이 있어요!',
    answer:
      "서비스 하단의 '문의하기' 버튼이나 카카오톡 채널을 통해 질문을 남겨주시면 빠르게 답변해 드리겠습니다.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(2) // 3번째 질문 기본적으로 열어둠

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-[1300px]">
        {/* Header */}
        <div className="mb-10 flex items-center gap-3">
          <img src="/img/logo.png" alt="Logo" className="h-12 w-12" />
          <h2 className="text-2xl font-bold text-[#5650FF] md:text-3xl">자주 묻는 질문들</h2>
        </div>

        {/* FAQ Container */}
        <div className="w-full rounded-3xl border border-[#9D9D9D] bg-[#F7F7F8] p-6 md:px-16">
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[#D9D9D9] pb-4 last:border-0 last:pb-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="group flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-lg font-medium text-[#414147] transition-colors group-hover:text-[#5650FF] md:text-xl">
                    {faq.question}
                  </span>
                  <span className="text-3xl font-light text-[#414147]">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>

                {/* Answer with Animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'mb-6 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="rounded-b-3xl border-t border-[#D9D9D9] bg-white p-8">
                    <p className="text-lg leading-relaxed text-[#414147]">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
