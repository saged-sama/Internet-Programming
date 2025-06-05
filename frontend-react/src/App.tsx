import './App.css'
import { Route, Routes } from 'react-router'
import LandingPage from './pages/landing'
import NoticesPage from './pages/notices'
import EventsPage from './pages/events'
import ContactPage from './pages/contact'
import DirectoryPage from './pages/directory'
import DirectoryDetailPage from './pages/directory/detail'
import MeetingsPage from './pages/meetings'
import LoginPage from './pages/auth/login'
import SignupPage from './pages/auth/signup'
import ForgotPasswordPage from './pages/auth/forgot-password'
import RegistrationSuccessPage from './pages/auth/registration-success'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/notices' element={<NoticesPage />} />
      <Route path='/events' element={<EventsPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/directory' element={<DirectoryPage />} />
      <Route path='/directory/:id' element={<DirectoryDetailPage />} />
      <Route path='/meetings' element={<MeetingsPage />} />
      {/* Authentication Routes */}
      <Route path='/auth/login' element={<LoginPage />} />
      <Route path='/auth/signup' element={<SignupPage />} />
      <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/auth/registration-success' element={<RegistrationSuccessPage />} />
    </Routes>
  )
}

export default App
