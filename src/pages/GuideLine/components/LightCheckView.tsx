const LightCheckView = ({onComplete}: { onComplete: () => void }) => {
  return (
    <div>
      <button onClick={onComplete} className="mt-4 rounded-full bg-indigo-500 px-6 py-2 text-white">
        조명 확인 완료 (다음 단계로)
      </button>
    </div>
  )
}

export default LightCheckView
