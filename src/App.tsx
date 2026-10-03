import RouterApp from "./routes/RouterApp"
import ThemeManager from "./themes/ThemeManager"
import { ErrorBoundary } from "./services/observability"

function App() {

  return (
    <ErrorBoundary>
      <ThemeManager>
        <RouterApp />
      </ThemeManager>
    </ErrorBoundary>
  )
}

export default App
