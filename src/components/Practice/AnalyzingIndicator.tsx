interface AnalyzingIndicatorProps {
  /** 로딩 아래에 보여줄 안내 문구 */
  message?: string
  /** 감싸는 영역의 최소 높이(px). 결과가 들어올 자리와 비슷하게 잡아 화면이 덜 튀게 한다. */
  minHeight?: number
}

/**
 * 4단계에서 녹음/연습은 끝났지만 서버 분석 결과(result)가 아직 오지 않은 동안 보여주는 로딩 표시.
 *
 * 서버는 음성 인식이나 시선 계산을 끝낸 뒤에야 결과를 보내므로 그 사이에 빈 화면이 뜬다.
 * 그대로 두면 사용자는 분석이 실패했거나 멈춘 것으로 오해한다.
 */
const AnalyzingIndicator = ({
  message = '분석하고 있습니다. 잠시만 기다려주세요.',
  minHeight = 150,
}: AnalyzingIndicatorProps) => (
  <div
    className="flex flex-col items-center justify-center gap-3"
    style={{ minHeight }}
    role="status"
    aria-live="polite"
  >
    <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#E0DFFF] border-t-[#5650FF]" />
    <p className="fontRegular text-[14px] text-[#5D5D5D]">{message}</p>
  </div>
)

export default AnalyzingIndicator
