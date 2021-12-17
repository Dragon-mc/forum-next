import { Router } from 'vue-router'
import { createAuthGuard } from './auth'

export function setupGuard(router: Router) {
  createAuthGuard(router)
}
