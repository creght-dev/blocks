import { Route, Routes } from "react-router-dom"

import { HomePage } from "./pages/HomePage"
import { IndexPage } from "./pages/IndexPage"
import { PreviewPage } from "./pages/PreviewPage"

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900 antialiased">
            <HomePage />
          </div>
        }
      />
      <Route path="/index" element={<IndexPage />} />
      <Route path="/preview/:slug" element={<PreviewPage />} />
    </Routes>
  )
}
