import Header from "./components/Header"
import BookList from "./components/BookList"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />

      <main className="max-w-7xl mx-auto">
        <BookList />
      </main>

      <Footer />
    </div>
  )
}

export default App