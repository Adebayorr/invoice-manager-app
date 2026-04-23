import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider } from './context/InvoiceContext'  // 👈 add
import Nav from './components/Nav'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetail from './pages/InvoiceDetail'

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>          {/* 👈 wrap everything */}
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="app-layout">
          <Nav />
          <main className="app-main" id="main-content">
            <Routes>
              <Route path="/" element={<InvoiceList />} />
              <Route path="/invoice/:id" element={<InvoiceDetail />} />
            </Routes>
          </main>
        </div>
      </InvoiceProvider>         {/* 👈 close it */}
    </ThemeProvider>
  )
}

export default App
