import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Named import

const JwtDecoder = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      setIsTokenValid(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token); // Use the jwtDecode function
      const currentTime = Math.floor(Date.now() / 1000);
      const isTokenValid = decodedToken.exp > currentTime; // Validate token expiration
      setDecodedToken(decodedToken);
      setIsTokenValid(isTokenValid);
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { decodedToken, isTokenValid, isLoading };
};

export default JwtDecoder;

