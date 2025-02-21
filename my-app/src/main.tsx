import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home/Home'
import { TaskProvider } from './Context/TaskContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskProvider>
      <Home />
    </TaskProvider>
  </StrictMode>,
)
