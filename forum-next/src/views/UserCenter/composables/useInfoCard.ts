import { useRouter } from 'vue-router'
import { RouteName, EditorRoute } from '@/enum/route'

export default function () {
  const $router = useRouter()

  const editType = (type: EditorRoute) => {
    $router.push({
      name: RouteName.EDIT_NAME,
      params: {
        type,
      },
    })
  }

  return {
    editType
  }
}