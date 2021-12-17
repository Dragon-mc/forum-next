import { App } from 'vue-demi'
import { authDirctive } from './auth'
import { imageDirctive } from './image'

export function registeDirectives(app: App) {
  authDirctive(app)
  imageDirctive(app)
}