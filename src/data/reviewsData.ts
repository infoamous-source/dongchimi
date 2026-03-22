export interface ReviewData {
  id: string
  field: string
  rating: number
  contract: '정규직' | '계약직' | '파트타임'
  avgSalary: string
  requirements: string
  review: string
  age: string
  experience: string
}

export const fields = ['전체', '아파트 경비', '배달', '요양보호사', '사무보조', '매장관리', '주차관리', '청소', '식당보조', '운전']

export const reviews: ReviewData[] = [
  { id: '1', field: '아파트 경비', rating: 4, contract: '계약직', avgSalary: '180~220만원', requirements: '경비지도사 자격증 (우대)', review: '밤근무가 힘들지만 낮근무는 괜찮아요. 주민들과 인사하는 게 보람있습니다. 체력만 되면 추천합니다.', age: '62세', experience: '전직 공무원' },
  { id: '2', field: '배달', rating: 3, contract: '파트타임', avgSalary: '200~300만원', requirements: '운전면허, 오토바이 가능', review: '체력적으로 힘들지만 시간 자유롭게 쓸 수 있어서 좋아요. 비 오는 날이 제일 힘듭니다.', age: '55세', experience: '전직 영업직' },
  { id: '3', field: '요양보호사', rating: 5, contract: '정규직', avgSalary: '200~250만원', requirements: '요양보호사 자격증 (필수)', review: '어르신을 돌보는 보람이 큽니다. 자격증 취득도 어렵지 않아요. 안정적인 일자리라 추천합니다.', age: '58세', experience: '전직 간호조무사' },
  { id: '4', field: '사무보조', rating: 4, contract: '계약직', avgSalary: '170~200만원', requirements: '컴퓨터 활용 기본', review: '서류 정리, 전화 응대 등 단순한 일이라 어렵지 않아요. 근무 환경이 편합니다.', age: '56세', experience: '전직 사무직' },
  { id: '5', field: '매장관리', rating: 3, contract: '파트타임', avgSalary: '150~200만원', requirements: '특별한 자격 없음', review: '서서 일하는 게 힘들지만 사람 만나는 걸 좋아하면 괜찮아요. 할인 혜택도 있어요.', age: '60세', experience: '전직 자영업' },
  { id: '6', field: '주차관리', rating: 4, contract: '계약직', avgSalary: '180~210만원', requirements: '운전면허', review: '단순하고 안정적이에요. 여름 겨울이 좀 힘들지만 실내 근무도 많아졌어요.', age: '63세', experience: '전직 택시기사' },
  { id: '7', field: '청소', rating: 3, contract: '파트타임', avgSalary: '150~180만원', requirements: '특별한 자격 없음', review: '아침 일찍 시작해서 오후엔 자유 시간이 있어요. 체력이 필요하지만 건강에 좋아요.', age: '61세', experience: '전직 주부' },
  { id: '8', field: '식당보조', rating: 3, contract: '파트타임', avgSalary: '140~180만원', requirements: '특별한 자격 없음', review: '식사가 제공되고 가까운 곳에서 일할 수 있어요. 점심시간이 바빠서 체력이 필요해요.', age: '59세', experience: '전직 식당 운영' },
  { id: '9', field: '운전', rating: 4, contract: '정규직', avgSalary: '220~280만원', requirements: '대형면허 또는 택시자격증', review: '경력을 살릴 수 있어서 좋아요. 출퇴근 버스 기사는 안정적이고 복지도 괜찮습니다.', age: '57세', experience: '전직 화물기사' },
  { id: '10', field: '아파트 경비', rating: 3, contract: '계약직', avgSalary: '170~200만원', requirements: '없음', review: '24시간 교대근무가 힘들 수 있어요. 하지만 쉬는 날이 많아서 부업도 가능합니다.', age: '65세', experience: '전직 제조업' },
  { id: '11', field: '요양보호사', rating: 4, contract: '정규직', avgSalary: '210~250만원', requirements: '요양보호사 자격증', review: '국비지원으로 자격증 따고 바로 취업했어요. 수요가 많아서 일자리 걱정은 없습니다.', age: '54세', experience: '전직 주부' },
  { id: '12', field: '배달', rating: 4, contract: '파트타임', avgSalary: '250~350만원', requirements: '운전면허', review: '쿠팡이츠로 시작했는데 시간당 벌이가 괜찮아요. 건강도 챙기고 돈도 벌고 일석이조입니다.', age: '52세', experience: '전직 자영업' },
  { id: '13', field: '사무보조', rating: 5, contract: '정규직', avgSalary: '190~220만원', requirements: '엑셀 기본', review: '정부 지원 사업으로 취업했어요. 분위기가 좋고 워라밸도 괜찮습니다. 교육도 잘 시켜줘요.', age: '53세', experience: '전직 회계' },
  { id: '14', field: '운전', rating: 5, contract: '정규직', avgSalary: '250~300만원', requirements: '1종 대형면허', review: '마을버스 기사인데 동네 분들이 잘 대해주셔서 보람있어요. 연금도 나와서 안정적입니다.', age: '60세', experience: '전직 버스기사' },
  { id: '15', field: '매장관리', rating: 4, contract: '정규직', avgSalary: '190~230만원', requirements: '없음', review: '편의점 점장이에요. 처음엔 POS기가 어려웠는데 금방 배웠어요. 사장님이 좋으면 일하기 편해요.', age: '58세', experience: '전직 유통업' },
]
