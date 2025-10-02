import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

// ✅ Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // ✅ Fetch using base URL
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        credentials: "include", // ✅ in case backend sets cookies/sessions
      });

      const data = await res.json();

      if (data.success === false) {
        console.error("Google auth failed:", data.message);
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/"); // ✅ redirect after success
    } catch (error) {
      console.error("Could not sign in with Google:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
