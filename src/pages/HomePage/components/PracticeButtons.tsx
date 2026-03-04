import { useState } from 'react'

const INITIAL_BUTTONS = [
  { id: 1, label: '스크립트 읽기', checked: true },
  { id: 2, label: '시선 연습', checked: true },
  { id: 3, label: '속도 연습', checked: true },
  { id: 4, label: '즉흥 연습', checked: false },
  { id: 5, label: '키워드 연습', checked: false },
  { id: 6, label: '핵심파악 연습', checked: false },
]

const CheckboxIcon = ({ checked }: { checked: boolean }) => {
  return (
    <div
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all"
      style={
        checked
          ? { backgroundColor: 'white', border: '1.5px solid #FFA956' }
          : { backgroundColor: 'white', border: '1.5px solid #FFA956' }
      }
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3.5}
            stroke="#FFA956"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  )
}

const PracticeButtons = () => {
  const [buttons, setButtons] = useState(INITIAL_BUTTONS)

  const toggle = (id: number) => {
    setButtons((prev) => prev.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b)))
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={() => toggle(btn.id)}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-all"
          style={
            btn.checked
              ? {
                  borderColor: '#FFA956',
                  backgroundColor: '#FFA956',
                  color: 'white',
                }
              : {
                  borderColor: '#FFA956',
                  backgroundColor: 'white',
                  color: '#FFA956',
                }
          }
        >
          <CheckboxIcon checked={btn.checked} />
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  )
}

export default PracticeButtons
