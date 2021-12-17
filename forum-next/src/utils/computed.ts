import { computed } from 'vue'
import { delHtmlTag } from './'
import moment from 'moment'
import { DateFormat } from '@/enum'
moment.locale('zh-cn')

export const delTagComputed = computed(function delTagComputed() {
  return (text: string) => delHtmlTag(text)
})

export const fromNow = computed(function fromNow() {
  return (time: string) => moment(time).fromNow()
})

export const timeParse = computed(function timeParse() {
  return (time: string | undefined) => moment(time).format(DateFormat.STANDER)
})