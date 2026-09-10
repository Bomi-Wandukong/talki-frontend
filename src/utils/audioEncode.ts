/**
 * 실시간 분석 WebSocket으로 오디오를 보낼 때 쓰는 인코딩 헬퍼.
 *
 * 브라우저의 AudioContext는 -1.0 ~ 1.0 범위의 Float32 PCM을 준다.
 * 서버(FastAPI)는 16bit PCM을 base64로 감싼 문자열을 기대하므로 두 단계를 거친다.
 *   Float32Array -> Int16Array -> base64 문자열
 */

/** -1.0~1.0 부동소수 PCM을 16bit 정수 PCM으로 변환 */
export function float32ToInt16(float32: Float32Array): Int16Array {
  const int16 = new Int16Array(float32.length)
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]))
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return int16
}

/**
 * 서버(FastAPI)가 오디오를 16kHz PCM으로 가정하고 읽는다.
 *
 * 브라우저 마이크는 보통 48kHz라, 변환 없이 보내면 서버가 길이를 3배로 계산한다.
 * 그러면 분당 단어 수(WPM)가 1/3로 떨어져 "말이 매우 느리다"는 잘못된 분석이 나온다.
 * 실제로 51초를 보냈을 때 서버가 duration_sec을 153초로 잡는 것을 확인했다.
 */
export const TARGET_SAMPLE_RATE = 16000

/**
 * 입력 PCM을 16kHz로 다운샘플링한다.
 *
 * 단순히 샘플을 건너뛰면 고음이 낮은 음으로 잘못 접혀 들리는 현상(에일리어싱)이 생기므로,
 * 묶이는 구간의 평균을 내서 값을 눌러준다.
 * 이미 16kHz이거나 그보다 낮으면 그대로 돌려준다.
 */
export function downsampleTo16k(input: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate <= TARGET_SAMPLE_RATE) return input

  const ratio = inputSampleRate / TARGET_SAMPLE_RATE
  const outputLength = Math.floor(input.length / ratio)
  const output = new Float32Array(outputLength)

  for (let i = 0; i < outputLength; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(Math.floor((i + 1) * ratio), input.length)
    let sum = 0
    for (let j = start; j < end; j++) sum += input[j]
    output[i] = end > start ? sum / (end - start) : 0
  }

  return output
}

/** ArrayBuffer를 base64 문자열로 변환 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
