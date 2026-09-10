interface RealtimeErrorBannerProps {
  /** 표시할 문구. null이면 아무것도 그리지 않는다. */
  message: string | null
  /** 아래 줄에 붙는 보조 설명. 생략하면 연결 실패용 기본 문구를 쓴다. */
  detail?: string
}

/**
 * 4단계 실시간 분석 WebSocket이 끊겼을 때 띄우는 경고 배너.
 *
 * 연결이 죽어도 화면은 그대로 동작해서(녹음 버튼이 눌리고 타이머가 돈다)
 * 사용자는 분석이 안 되고 있다는 걸 알 방법이 없다. 그래서 상단에 명시적으로 알린다.
 */
const RealtimeErrorBanner = ({
  message,
  detail = '지금 진행해도 분석 결과는 저장되지 않습니다.',
}: RealtimeErrorBannerProps) => {
  if (!message) return null

  return (
    <div
      role="alert"
      className="mb-4 flex items-center gap-3 rounded-xl border border-[#E9A8A8] bg-[#FDF0F0] px-5 py-3"
    >
      <span className="fontBold flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E05F5F] text-[13px] text-white">
        !
      </span>
      <div>
        <p className="fontSB text-[14px] text-[#C94F4F]">{message}</p>
        <p className="fontRegular mt-0.5 text-[13px] text-[#B08585]">{detail}</p>
      </div>
    </div>
  )
}

export default RealtimeErrorBanner
