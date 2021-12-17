import { ref } from 'vue'
import { fetchCarouselList } from '@/api'
import type { CarouselItem } from '@/types/carousel'

export default function () {
  const carouselList = ref<Array<CarouselItem>>([])
  const getCarouselList = async () => {
    let res = await fetchCarouselList()
    carouselList.value = res.data
  }
  getCarouselList()
  return {
    carouselList
  }
}
