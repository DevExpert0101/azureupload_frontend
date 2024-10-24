
import React from "react";
import { useMsal } from "@azure/msal-react";

const AuthButton: React.FC = () => {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginPopup({
      scopes: ["User.Read"], // Define the scopes you need, e.g., User.Read
    }).then(response => {
      console.log("Login successful:", response);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(response));
    }).catch(error => {
      console.error("Login error:", error);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(error => {
      console.error("Logout error:", error);
    });
  };

  return (
    <div>
      {accounts.length > 0 ? (
        <div>
          <p>Hello, {accounts[0].name}!</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">
          Login with Microsoft
        </button>
      )}
    </div>
  );
};

export default AuthButton;

