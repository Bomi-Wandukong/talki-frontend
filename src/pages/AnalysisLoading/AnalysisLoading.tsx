import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '@/api/fetchClient'

interface AnalysisState {
  key: string
  presentationId: string
  presentationType: string
  topic_summary?: string
  topic_desc?: string
  topic_tags?: string[]
}

export default function AnalysisLoading() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as AnalysisState

  useEffect(() => {
    if (!state || !state.key) {
      console.error('Invalid state for analysis loading')
      navigate('/')
      return
    }

    const startAnalysis = async () => {
      try {
        const queryParams = new URLSearchParams({
          key: state.key,
          presentationType: state.presentationType || 'online_small',
        })

        await api.post(`/analyze/start?${queryParams.toString()}`, {
          topic_summary: state.topic_summary || '',
          topic_desc: state.topic_desc || '',
          topic_tags: state.topic_tags || [],
        })

        // 분석 결과가 나올 때까지 폴링 (최대 20회, 3초 간격 = 약 1분)
        const pollForResult = async (retries = 20) => {
          if (retries <= 0) {
            throw new Error('Analysis timeout: 분석 시간이 너무 오래 걸립니다.')
          }

          try {
            const res = await api.get(`/analyze/getResult?presentationId=${state.presentationId}`)

            // 결과 데이터가 유효한지 확인 (예: 점수가 포함되어 있는지)
            if (res && res.totalScore !== undefined) {
              navigate('/result', { state: { presentationId: state.presentationId } })
              return
            }
          } catch (e) {
            // 아직 결과가 생성되지 않았거나 서버 처리 중인 경우
            console.log(`Waiting for analysis... (${retries} retries left)`)
          }

          // 3초 뒤에 다시 시도
          setTimeout(() => pollForResult(retries - 1), 3000)
        }

        await pollForResult()
      } catch (err) {
        console.error('Failed to start analysis:', err)
        alert('분석을 시작하지 못했습니다. 다시 시도해주세요.')
        navigate('/')
      }
    }

    startAnalysis()
  }, [state, navigate])

  const userName = localStorage.getItem('userName') || '사용자'

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F7F7F8] px-6">
      <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
        {/* Animated Background Rings */}
        <div className="absolute h-full w-full animate-ping rounded-full bg-[#5650FF]/20 duration-[3000ms]"></div>
        <div className="absolute h-[80%] w-[80%] animate-pulse rounded-full bg-[#5650FF]/40"></div>
        
        {/* Main Spinner */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#5650FF] border-t-transparent shadow-lg"></div>
      </div>

      <h1 className="mb-4 text-center text-2xl font-bold text-[#3B3B3B] md:text-3xl">
        영상을 분석하고 있어요
      </h1>
      <p className="max-w-md text-center text-sm leading-relaxed text-gray-500 md:text-base">
        AI가 {userName} 님의 시선 처리, 발화 속도, 제스처를 꼼꼼하게 <br className="hidden md:block" />
        살펴보고 있습니다. 잠시만 기다려주세요!
      </p>

      {/* Glassmorphism Tips Card */}
      <div className="mt-16 w-full max-w-sm rounded-3xl border border-white/40 bg-white/30 p-8 shadow-xl backdrop-blur-md">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#5650FF]">Tip</p>
        <p className="text-sm font-medium text-[#3B3B3B]">
          발표 시 시선을 골고루 분산시키면 청중의 몰입도가 훨씬 높아진다는 사실, 알고 계셨나요?
        </p>
      </div>
    </div>
  )
}
