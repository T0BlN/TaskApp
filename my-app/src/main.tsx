import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Pages/Home/Home';
import Trash from './Pages/Trash/Trash';
import { TaskProvider } from './Context/TaskContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskProvider>
      <BrowserRouter basename="/TaskApp">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trash" element={<Trash />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  </StrictMode>,
)
