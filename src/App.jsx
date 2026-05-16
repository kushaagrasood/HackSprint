import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@context/AuthContext'
import { HackSprintProvider } from '@context/HackSprintContext'
import AppRoutes from '@/routes'

function App() {
  return (
    <Router>
      <AuthProvider>
        <HackSprintProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </HackSprintProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

// Made with Bob
