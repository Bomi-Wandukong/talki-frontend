import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * 특정 엘리먼트를 PDF로 캡처하여 다운로드합니다.
 * @param elementId 캡처할 HTML 엘리먼트의 ID
 * @param fileName 저장할 파일 이름
 */
const captureAndDownload = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id ${elementId} not found`)
    return
  }

  try {
    // 0. 비디오 요소들이 로드될 때까지 대기
    const videosInElement = element.getElementsByTagName('video')
    const videoLoadPromises = Array.from(videosInElement).map((video) => {
      if (video.readyState >= 2) return Promise.resolve()
      return new Promise<void>((resolve) => {
        const onCanPlay = () => {
          video.removeEventListener('canplay', onCanPlay)
          resolve()
        }
        video.addEventListener('canplay', onCanPlay)
        // 브라우저에 따라 명시적 로드가 필요할 수 있음
        if (video.paused) video.load()

        // 너무 오래 걸릴 경우를 대비한 타임아웃 (3초)
        setTimeout(resolve, 3000)
      })
    })
    await Promise.all(videoLoadPromises)

    // 애니메이션이 완전히 정착되고 데이터가 렌더링될 때까지 충분히 대기 (1.5초)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 1. html2canvas로 엘리먼트를 캔버스로 변환
    const canvas = await html2canvas(element, {
      scale: 2, // 고해상도 품질
      useCORS: true, // 외부 이미지 로드 허용
      logging: false,
      backgroundColor: '#F7F7F8', // 배경색 명시적 지정
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId)
        if (!clonedElement) return

        // [스타일 보정] 애니메이션 및 트랜지션 강제 중단
        // IntersectionObserver로 인해 숨겨진 요소들(opacity-0)을 강제로 표시
        const allElements = clonedElement.getElementsByTagName('*')
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement

          // 애니메이션 중단
          el.style.animation = 'none'
          el.style.transition = 'none'

          // 숨겨진 섹션 강제 표시 (Tailwind opacity-0 대응)
          if (el.classList.contains('opacity-0')) {
            el.style.opacity = '1'
          }
          if (el.classList.contains('translate-y-10') || el.classList.contains('translate-y-5')) {
            el.style.transform = 'none'
          }
        }

        // [비디오 캡처 처리] 비디오 태그의 현재 프레임을 이미지로 대체
        // html2canvas는 비디오를 직접 캡처하지 못하므로 캔버스로 변환하여 전달
        const videos = clonedDoc.getElementsByTagName('video')
        const originalVideos = element.getElementsByTagName('video')

        for (let i = 0; i < videos.length; i++) {
          const video = videos[i]
          const originalVideo = originalVideos[i]

          if (originalVideo && originalVideo.readyState >= 2) {
            const videoCanvas = clonedDoc.createElement('canvas')
            videoCanvas.width = originalVideo.videoWidth
            videoCanvas.height = originalVideo.videoHeight
            const ctx = videoCanvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(originalVideo, 0, 0, videoCanvas.width, videoCanvas.height)
              const img = clonedDoc.createElement('img')
              img.src = videoCanvas.toDataURL('image/png')
              img.className = video.className
              img.style.width = '100%'
              img.style.height = 'auto'
              img.style.display = 'block'
              img.style.borderRadius = '8px'
              video.parentNode?.replaceChild(img, video)
            }
          }
        }
      },
    })

    const imgData = canvas.toDataURL('image/png')

    // 2. jspdf로 PDF 생성 (A4 기준)
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    const doc = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // 첫 페이지
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // 다중 페이지 처리
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // 3. 파일 저장
    const now = new Date()
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(
      now.getMinutes()
    ).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

    doc.save(`${fileName}_${timestamp}.pdf`)
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error)
    throw error
  }
}

/**
 * 기본 분석 결과 다운로드
 */
export const downloadBasicPDF = async () => {
  await captureAndDownload('basic-analysis-content', 'talki_basic_feedback')
}

/**
 * 전체 분석 결과 다운로드
 */
export const downloadFullPDF = async () => {
  await captureAndDownload('full-analysis-content', 'talki_full_feedback')
}
