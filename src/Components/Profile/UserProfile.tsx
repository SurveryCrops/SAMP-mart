import {
  getAuth,
  onAuthStateChanged,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUsername(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL);
      }
    });
    return () => unsubscribe();
  }, []);

  function handleBackBtn() {
    navigate(-1);
  }

  function handleEditBtn() {
    setIsEditClicked(true);
  }

  async function handleSaveButton() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      await updateProfile(user, { displayName: username });
      await updateEmail(user, email);

      setIsEditClicked(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile: " + error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-md w-full">
        {/* Top banner */}
        <div className="bg-indigo-500 h-32 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
                {username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-20 text-center px-6 pb-6">
          {isEditClicked ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700 w-full text-center mb-2"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700 w-full text-center mb-4"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
              <p className="text-gray-500 mb-4">{email}</p>
            </>
          )}

          <div className="flex justify-center space-x-4 mt-6">
            {isEditClicked ? (
              <button
                onClick={handleSaveButton}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditBtn}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleBackBtn}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
