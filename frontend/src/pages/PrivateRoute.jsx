import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
  //console.log("user-privateroute", user);
  //console.log("token-privateroute", token);
  //console.log("roles-privateroute", roles);
  try {
    if (roles && !roles.includes(user.rol)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    //console.error("Error al decodificar el token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
