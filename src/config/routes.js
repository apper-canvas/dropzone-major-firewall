import Home from '@/components/pages/Home'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Callback from '@/pages/Callback'
import ErrorPage from '@/pages/ErrorPage'
import ResetPassword from '@/pages/ResetPassword'
import PromptPassword from '@/pages/PromptPassword'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Upload',
    component: Home
  },
  login: {
    id: 'login',
    label: 'Login',
    path: '/login',
    icon: 'LogIn',
    component: Login
  },
  signup: {
    id: 'signup',
    label: 'Sign Up',
    path: '/signup',
    icon: 'UserPlus',
    component: Signup
  },
  callback: {
    id: 'callback',
    label: 'Callback',
    path: '/callback',
    icon: 'RefreshCw',
    component: Callback
  },
  error: {
    id: 'error',
    label: 'Error',
    path: '/error',
    icon: 'AlertTriangle',
    component: ErrorPage
  },
  resetPassword: {
    id: 'resetPassword',
    label: 'Reset Password',
    path: '/reset-password/:appId/:fields',
    icon: 'Key',
    component: ResetPassword
  },
  promptPassword: {
    id: 'promptPassword',
    label: 'Prompt Password',
    path: '/prompt-password/:appId/:emailAddress/:provider',
    icon: 'Lock',
    component: PromptPassword
  }
}

export const routeArray = [
  routes.home
]