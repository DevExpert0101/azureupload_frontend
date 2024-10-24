import "./App.css";
import FileExplorer from "./components/FileExplorer";
import LoginSignUp from "./components/LoginSignup";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { useEffect, useState } from "react";
// import AuthButton from "./components/AuthButton";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if(token) {
      try {
        const SECRET_KEY = "1"; // Ensure this matches the backend
        const decode: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decode.exp > currentTime) {
          console.log('ex', decode.exp)
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);


  return (
    <MsalProvider instance={msalInstance}>
      <div className="flex w-full h-[80vh] mx-auto">
        <div
          className={`flex-grow flex flex-col items-center justify-center `}
        >
          {!isAuthenticated ? <LoginSignUp onAuthSuccess={() => setIsAuthenticated(true)} /> : <FileExplorer />}
        </div>
      </div>
    </MsalProvider>
  );
}

export default App;
