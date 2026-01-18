import TestButton from '@/pages/Test/components/TestButton'

export default function Test() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <TestButton label="절대경로 테스트 버튼" onClick={() => alert('절대경로(@) 정상 작동!')} />
    </div>
  )
}
