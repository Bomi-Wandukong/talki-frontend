interface TriangleChartProps {
  gazeScore: number
  postureScore: number
  topicScore: number
}

const toRad = (deg: number) => (deg * Math.PI) / 180

export default function TriangleChart({ gazeScore, postureScore, topicScore }: TriangleChartProps) {
  const cx = 165
  const cy = 138
  const r = 95

  const topAngle = toRad(-90)
  const brAngle = toRad(30)
  const blAngle = toRad(150)

  const vtx = (angle: number, scale = 1): [number, number] => [
    cx + r * scale * Math.cos(angle),
    cy + r * scale * Math.sin(angle),
  ]

  const [tx, ty] = vtx(topAngle)
  const [brx, bry] = vtx(brAngle)
  const [blx, bly] = vtx(blAngle)

  const [dtx, dty] = vtx(topAngle, gazeScore / 100)
  const [dbrx, dbry] = vtx(brAngle, topicScore / 100)
  const [dblx, dbly] = vtx(blAngle, postureScore / 100)

  const gridPoints = (scale: number) => {
    const [ax, ay] = vtx(topAngle, scale)
    const [bx, by] = vtx(brAngle, scale)
    const [ex, ey] = vtx(blAngle, scale)
    return `${ax},${ay} ${bx},${by} ${ex},${ey}`
  }

  return (
    <svg
      viewBox="0 0 330 260"
      className="mx-auto h-auto min-w-[240px] overflow-visible"
      style={{ maxWidth: 300 }}
    >
      <defs>
        <linearGradient id="triGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFAB76" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFC78A" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 그리드 삼각형 */}
      {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
        <polygon
          key={level}
          points={gridPoints(level)}
          fill="none"
          stroke={level === 1 ? '#C8C5F0' : '#EEEDF8'}
          strokeWidth={level === 1 ? 1.5 : 1}
        />
      ))}

      {/* 중심 → 꼭지점 축선 */}
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#EEEDF8" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={brx} y2={bry} stroke="#EEEDF8" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={blx} y2={bly} stroke="#EEEDF8" strokeWidth="1" />

      {/* 데이터 삼각형 */}
      <polygon
        points={`${dtx},${dty} ${dbrx},${dbry} ${dblx},${dbly}`}
        fill="url(#triGrad)"
        stroke="#FF8C42"
        strokeWidth="1.5"
      />

      {/* 꼭지점 점 */}
      <circle cx={dtx} cy={dty} r="4" fill="#FF8C42" />
      <circle cx={dbrx} cy={dbry} r="4" fill="#FF8C42" />
      <circle cx={dblx} cy={dbly} r="4" fill="#FF8C42" />

      {/* 레이블: 시선 집중도 (상단) */}
      <text
        x={tx}
        y={ty - 14}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#5650FF"
      >
        시선 집중도 {gazeScore}점
      </text>

      {/* 레이블: 주제 적절성 (우하단) */}
      <text
        x={brx}
        y={bry + 20}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#5650FF"
      >
        주제 적절성 {topicScore}점
      </text>

      {/* 레이블: 제스처 안정성 (좌하단) */}
      <text
        x={blx}
        y={bly + 20}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#5650FF"
      >
        제스처 안정성 {postureScore}점
      </text>
    </svg>
  )
}
