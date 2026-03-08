import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import QueryProvider from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;