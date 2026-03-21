export type DepartmentId = 'digital' | 'career'

export interface Department {
  id: DepartmentId
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
}

export const departments: Department[] = [
  {
    id: 'digital',
    title: '디지털학과',
    description: '스마트폰, 인터넷, AI 등 디지털 기초를 배워요',
    icon: '📱',
    color: '#2563eb',
    bgColor: '#eff6ff',
  },
  {
    id: 'career',
    title: '커리어학과',
    description: '이력서, 자기소개서 작성과 취업 정보를 알아봐요',
    icon: '💼',
    color: '#059669',
    bgColor: '#ecfdf5',
  },
]
