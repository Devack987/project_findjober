import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>Flavouille de l'amour</h1>
        </div>
        <button
          type="button"
          className="Go to app page"
          onClick={() => setCount((count) => count + 1)}
        >
          Click : {count}
        </button>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
