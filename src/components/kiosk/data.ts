export type KioskScreen = 'welcome' | 'dine' | 'menu' | 'options' | 'confirm' | 'payment' | 'processing' | 'complete'

export const SCREEN_ORDER: KioskScreen[] = ['welcome', 'dine', 'menu', 'options', 'confirm', 'payment', 'processing', 'complete']

export const SCREEN_LABELS: Record<KioskScreen, string> = {
  welcome: '시작',
  dine: '매장/포장',
  menu: '메뉴 선택',
  options: '옵션 선택',
  confirm: '주문 확인',
  payment: '결제',
  processing: '결제 중',
  complete: '완료',
}

export const HELPER_MESSAGES: Record<KioskScreen, string> = {
  welcome: '화면을 터치해서 주문을 시작해보세요!',
  dine: '매장에서 드실 건지, 가져가실 건지 골라주세요.',
  menu: '원하는 메뉴를 눌러보세요. 여러 개 담을 수 있어요!',
  options: '음료 옵션을 골라주세요. 다 고르면 "담기"를 누르세요.',
  confirm: '주문한 메뉴가 맞는지 확인하고 "결제하기"를 누르세요.',
  payment: '결제 방법을 골라주세요.',
  processing: '잠시만 기다려주세요. 결제하고 있어요.',
  complete: '주문이 끝났어요! 잘 하셨습니다!',
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category: 'coffee' | 'drink' | 'dessert'
  popular?: boolean
}

export interface OptionItem {
  id: string
  name: string
  priceAdd: number
}

export interface CartItem {
  menu: MenuItem
  options: OptionItem[]
  quantity: number
}

export const categories = [
  { id: 'coffee', name: '커피' },
  { id: 'drink', name: '음료' },
  { id: 'dessert', name: '디저트' },
]

export const menuItems: MenuItem[] = [
  { id: 'americano', name: '아메리카노', price: 4500, category: 'coffee', popular: true },
  { id: 'latte', name: '카페라떼', price: 5000, category: 'coffee', popular: true },
  { id: 'mocha', name: '카페모카', price: 5500, category: 'coffee' },
  { id: 'cappuccino', name: '카푸치노', price: 5000, category: 'coffee' },
  { id: 'juice-orange', name: '오렌지주스', price: 5500, category: 'drink', popular: true },
  { id: 'juice-strawberry', name: '딸기주스', price: 6000, category: 'drink' },
  { id: 'smoothie', name: '망고스무디', price: 6000, category: 'drink' },
  { id: 'tea-green', name: '녹차', price: 4500, category: 'drink' },
  { id: 'cake-choco', name: '초코케이크', price: 5500, category: 'dessert', popular: true },
  { id: 'cookie', name: '쿠키세트', price: 3500, category: 'dessert' },
  { id: 'muffin', name: '블루베리머핀', price: 3800, category: 'dessert' },
  { id: 'croissant', name: '크루아상', price: 3500, category: 'dessert' },
]

export const optionItems: OptionItem[] = [
  { id: 'hot', name: '뜨겁게 (HOT)', priceAdd: 0 },
  { id: 'ice', name: '차갑게 (ICE)', priceAdd: 0 },
  { id: 'extra-shot', name: '샷 추가', priceAdd: 500 },
  { id: 'size-up', name: '사이즈업', priceAdd: 700 },
]

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => {
    const optionPrice = item.options.reduce((s, o) => s + o.priceAdd, 0)
    return sum + (item.menu.price + optionPrice) * item.quantity
  }, 0)
}
