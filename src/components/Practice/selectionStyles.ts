/**
 * 연습탭 선택지 카드의 공통 스타일.
 *
 * 화면마다 선택 색과 테두리 두께가 조금씩 달라서(#e7e7ff / #e8e7ff / #EDECFF …)
 * 같은 동작인데도 다르게 보였다. 여기 한 곳에서 관리한다.
 *
 * 테두리는 border가 아니라 ring을 쓴다. border는 요소의 크기를 바꾸지만
 * ring은 바깥에 그려져 크기에 영향이 없어서, 선택할 때 카드가 밀리지 않는다.
 * 선택 여부와 관계없이 항상 ring-2로 두께를 고정하고 색만 바꾼다.
 */

/** 모든 상태에 공통으로 들어가는 클래스. 두께 고정은 여기서 한다. */
export const SELECTION_BASE = 'ring-2 transition-all'

/** 선택된 상태 */
export const SELECTION_SELECTED = 'bg-[#EDECFF] ring-[#5650FF]'

/** 선택 가능한 기본 상태 */
export const SELECTION_IDLE = 'bg-white ring-[#E5E5E5] hover:ring-[#5650FF]/40'

/** 다른 항목이 선택되어 고를 수 없는 상태 */
export const SELECTION_DISABLED = 'bg-[#F5F5F5] ring-[#E5E5E5] opacity-50'

/** 상태에 맞는 클래스를 돌려준다. */
export const selectionClass = (state: 'selected' | 'idle' | 'disabled') =>
  `${SELECTION_BASE} ${
    state === 'selected'
      ? SELECTION_SELECTED
      : state === 'disabled'
        ? SELECTION_DISABLED
        : SELECTION_IDLE
  }`
