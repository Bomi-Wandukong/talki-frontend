export default function RequirementsSection() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="w-full max-w-[1300px]">
        {/* Header */}
        <div className="mb-16 flex items-center gap-3">
          <img src="/img/logo.png" alt="Talki" className="w-12" />
          <h2 className="text-2xl font-bold text-[#ACA9FE] md:text-3xl">
            TALKI를 사용할 때, <span className="text-[#5650FF]">아래의 준비물</span>이 필요해요
          </h2>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* 카메라 */}
          <div className="flex items-start gap-8 rounded-3xl bg-[#F7F7F8] p-[10%] shadow-sm">
            <img src="/img/camera.png" alt="Camera" className="mr-9" />

            <div className="flex h-full flex-col justify-center">
              <h3 className="mb-3 text-2xl font-bold text-[#5650FF]">카메라</h3>
              <p className="text-lg leading-relaxed text-gray-600">
                분석을 위해 촬영이 진행됩니다.
                <br />
                노트북 캠과 같은 카메라를 준비해주세요.
              </p>
            </div>
          </div>

          {/* 네트워크 */}
          <div className="flex min-h-[160px] flex-col justify-center rounded-3xl bg-[#F7F7F8] p-[10%] shadow-sm">
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              <span className="text-[#5650FF]">안정적인 네트워크 환경</span>에서 진행해주세요.
            </h3>
            <p className="text-lg leading-relaxed text-gray-600">
              다수가 사용하는 네트워크보다는 개인 네트워크를 추천해요
            </p>
          </div>

          {/* 마이크 */}
          <div className="flex items-start gap-8 rounded-3xl bg-[#F7F7F8] p-[10%] shadow-sm">
            <img src="/img/mic.png" alt="Mic" />
            <div className="flex h-full flex-col justify-center">
              <h3 className="mb-3 text-2xl font-bold text-[#5650FF]">마이크</h3>
              <p className="text-lg leading-relaxed text-gray-600">
                분석을 위해 녹음이 진행됩니다.
                <br />
                마이크와 주변이 조용한 환경에서
                <br />
                진행해주세요.
              </p>
            </div>
          </div>

          {/* PC 환경 */}
          <div className="flex min-h-[160px] flex-col justify-center rounded-3xl bg-[#F7F7F8] p-[10%] shadow-sm">
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              <span className="text-[#5650FF]">Window7 이상의 PC</span>를 사용해주세요.
            </h3>
            <p className="text-lg leading-relaxed text-gray-600">
              실전과 연습은 모바일 환경에서 사용이 어려워요.
              <br />
              PC 환경에서 진행해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
