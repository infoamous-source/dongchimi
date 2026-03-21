export interface PracticeScenario {
  id: string
  title: string
  description: string
  icon: string
  iconColor: string
  bgColor: string
  steps: PracticeStep[]
}

export interface PracticeStep {
  id: string
  instruction: string
  options?: { label: string; correct: boolean; feedback: string }[]
  type: 'info' | 'choice' | 'confirm'
}

export const practiceScenarios: PracticeScenario[] = [
  {
    id: 'atm',
    title: 'ATM 사용하기',
    description: '현금 인출, 송금을 안전하게 연습해봐요',
    icon: 'Landmark',
    iconColor: '#2563eb',
    bgColor: '#dbeafe',
    steps: [
      {
        id: 'atm-1',
        instruction: 'ATM 기기 앞에 왔습니다. 먼저 무엇을 할까요?',
        type: 'choice',
        options: [
          { label: '카드를 넣는다', correct: true, feedback: '맞아요! 카드를 카드 투입구에 넣어주세요.' },
          { label: '화면을 터치한다', correct: false, feedback: '먼저 카드를 넣어야 시작할 수 있어요.' },
          { label: '통장을 넣는다', correct: false, feedback: '현금카드나 체크카드를 넣어주세요.' },
        ],
      },
      {
        id: 'atm-2',
        instruction: '카드를 넣었습니다. 화면에 비밀번호를 입력하라고 나왔어요.',
        type: 'info',
      },
      {
        id: 'atm-3',
        instruction: '비밀번호를 입력할 때 주의할 점은?',
        type: 'choice',
        options: [
          { label: '손으로 가리고 입력한다', correct: true, feedback: '정답! 다른 사람이 볼 수 없게 꼭 가려주세요.' },
          { label: '빨리 입력한다', correct: false, feedback: '빨리보다 가리는 게 더 중요해요.' },
          { label: '큰 소리로 말하면서 입력한다', correct: false, feedback: '비밀번호는 절대 소리내어 말하면 안 돼요!' },
        ],
      },
      {
        id: 'atm-4',
        instruction: '원하는 거래를 선택하세요.',
        type: 'choice',
        options: [
          { label: '출금 (돈 빼기)', correct: true, feedback: '출금을 선택했어요. 금액을 입력해주세요.' },
          { label: '입금 (돈 넣기)', correct: true, feedback: '입금을 선택했어요. 돈을 투입구에 넣어주세요.' },
          { label: '송금 (돈 보내기)', correct: true, feedback: '송금을 선택했어요. 받는 분 계좌번호를 입력해주세요.' },
        ],
      },
      {
        id: 'atm-5',
        instruction: '거래가 완료되었습니다! 카드와 명세표를 꼭 가져가세요. 잘 하셨어요!',
        type: 'confirm',
      },
    ],
  },
  {
    id: 'shopping',
    title: '온라인 쇼핑하기',
    description: '쿠팡에서 물건 주문하는 연습을 해봐요',
    icon: 'ShoppingCart',
    iconColor: '#16a34a',
    bgColor: '#dcfce7',
    steps: [
      {
        id: 'shop-1',
        instruction: '쿠팡 앱을 열었습니다. 비타민을 사고 싶어요. 어떻게 할까요?',
        type: 'choice',
        options: [
          { label: '위쪽 검색창에 "비타민" 입력', correct: true, feedback: '맞아요! 검색창에 원하는 물건 이름을 입력하면 돼요.' },
          { label: '화면을 아래로 계속 내린다', correct: false, feedback: '검색을 하면 더 빨리 찾을 수 있어요.' },
          { label: '전화해서 물어본다', correct: false, feedback: '앱에서 직접 검색하는 게 편리해요.' },
        ],
      },
      {
        id: 'shop-2',
        instruction: '검색 결과가 나왔어요. 마음에 드는 비타민을 찾았습니다. 다음은?',
        type: 'choice',
        options: [
          { label: '상품을 터치해서 상세 정보 보기', correct: true, feedback: '좋아요! 가격, 리뷰, 배송일을 꼭 확인하세요.' },
          { label: '바로 구매 버튼 누르기', correct: false, feedback: '상품 정보를 먼저 확인하는 게 좋아요.' },
        ],
      },
      {
        id: 'shop-3',
        instruction: '상품이 마음에 들어요. "구매하기" 버튼을 눌렀습니다. 배송지 주소를 확인하세요.',
        type: 'info',
      },
      {
        id: 'shop-4',
        instruction: '결제 방법을 선택하세요.',
        type: 'choice',
        options: [
          { label: '카드 결제', correct: true, feedback: '카드 정보를 입력하면 결제가 완료돼요.' },
          { label: '무통장 입금', correct: true, feedback: '안내된 계좌로 입금하면 돼요.' },
          { label: '카카오페이', correct: true, feedback: '카카오페이로 간편하게 결제할 수 있어요.' },
        ],
      },
      {
        id: 'shop-5',
        instruction: '주문이 완료되었습니다! "내 주문" 메뉴에서 배송 상황을 확인할 수 있어요. 잘 하셨어요!',
        type: 'confirm',
      },
    ],
  },
  {
    id: 'transport',
    title: '교통 앱 사용하기',
    description: '카카오맵으로 길 찾기를 연습해봐요',
    icon: 'Train',
    iconColor: '#d97706',
    bgColor: '#fef3c7',
    steps: [
      {
        id: 'trans-1',
        instruction: '카카오맵 앱을 열었습니다. 서울역에 가고 싶어요.',
        type: 'choice',
        options: [
          { label: '검색창에 "서울역" 입력', correct: true, feedback: '맞아요! 가고 싶은 곳을 검색해주세요.' },
          { label: '지도를 손가락으로 움직인다', correct: false, feedback: '검색이 더 빠르고 정확해요.' },
        ],
      },
      {
        id: 'trans-2',
        instruction: '서울역이 검색되었어요. "길찾기" 버튼을 누르세요.',
        type: 'info',
      },
      {
        id: 'trans-3',
        instruction: '어떤 교통수단으로 갈까요?',
        type: 'choice',
        options: [
          { label: '대중교통 (버스, 지하철)', correct: true, feedback: '버스와 지하철 경로가 나와요. 시간과 요금도 확인할 수 있어요.' },
          { label: '자동차', correct: true, feedback: '운전 경로와 예상 시간이 나와요.' },
          { label: '도보 (걸어가기)', correct: true, feedback: '걸어가는 경로와 시간이 나와요.' },
        ],
      },
      {
        id: 'trans-4',
        instruction: '경로를 확인했어요! 출발 시간과 도착 예정 시간을 확인하세요. 잘 하셨어요!',
        type: 'confirm',
      },
    ],
  },
  {
    id: 'payment',
    title: '모바일 결제하기',
    description: '카카오페이로 결제하는 연습을 해봐요',
    icon: 'CreditCard',
    iconColor: '#7c3aed',
    bgColor: '#ede9fe',
    steps: [
      {
        id: 'pay-1',
        instruction: '편의점에서 물건을 샀어요. 카카오페이로 결제하려면?',
        type: 'choice',
        options: [
          { label: '카카오톡 → 더보기 → 카카오페이', correct: true, feedback: '맞아요! 카카오톡에서 카카오페이를 열 수 있어요.' },
          { label: '카메라 앱을 연다', correct: false, feedback: '카카오톡에서 카카오페이를 찾아주세요.' },
        ],
      },
      {
        id: 'pay-2',
        instruction: '카카오페이가 열렸어요. "결제" 버튼을 눌러주세요.',
        type: 'info',
      },
      {
        id: 'pay-3',
        instruction: '바코드 화면이 나왔어요. 이것을 어떻게 하나요?',
        type: 'choice',
        options: [
          { label: '점원에게 바코드 화면을 보여준다', correct: true, feedback: '정답! 점원이 바코드를 스캔하면 결제가 완료돼요.' },
          { label: '바코드를 캡쳐한다', correct: false, feedback: '바코드 화면을 그대로 보여주면 돼요.' },
        ],
      },
      {
        id: 'pay-4',
        instruction: '결제가 완료되었습니다! 카카오톡 알림으로 결제 내역을 확인할 수 있어요. 잘 하셨어요!',
        type: 'confirm',
      },
    ],
  },
]

export function getPracticeById(id: string): PracticeScenario | undefined {
  return practiceScenarios.find(p => p.id === id)
}
