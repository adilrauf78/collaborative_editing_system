import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyDocuments from "./pages/MyDocuments";
import CreateDocument from "./pages/CreateDocument";
import DocumentEditor from "./pages/DocumentEditor";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import VersionPage from "./pages/VersionPage";


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/mydocuments"
          element={
            <ProtectedRoute>
              <MyDocuments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/createdocument"
          element={
            <ProtectedRoute>
              <CreateDocument />
            </ProtectedRoute>
          }
        />

        <Route
          path="/document/:id"
          element={
            <ProtectedRoute>
              <DocumentEditor />
            </ProtectedRoute>
          }
        />
         {/* Versioning route */}
          <Route
            path="/document/:id/versions"
            element={
              <ProtectedRoute>
                <VersionPage />
              </ProtectedRoute>
            }
          />


        {/* Default route */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
