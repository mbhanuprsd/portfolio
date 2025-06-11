import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";

// Add your admin email(s) here
const ALLOWED_ADMIN_EMAILS = [process.env.REACT_APP_FIREBASE_ADMIN_EMAIL];

// AdminChatPanel component
const AdminChatPanel = ({ user, setUser, emailVerified }) => {
  // State for chat messages, reply input, selected user, admin login form, and admin status
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef(null);

  // Check for admin custom claim (replace with your own logic if using Firebase custom claims)
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        setIsAdmin(ALLOWED_ADMIN_EMAILS.includes(user.email));
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  // Fetch messages from Firestore if admin is logged in
  useEffect(() => {
    if (!user || !isAdmin) return;
    const q = query(collection(db, "chats"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user, isAdmin]);

  // Auto-scroll to the bottom of the chat when messages or selected user changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  // Get unique users (excluding admin) for the user list
  const users = Array.from(
    new Set(messages.filter(m => !m.isAdmin).map(m => m.sender))
  );

  // Filter messages for the selected user and admin
  const chat = messages.filter(
    m => m.sender === selectedUser || (m.isAdmin && m.sender === selectedUser)
  );

  // Handle admin login form submission
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      // If email is not verified, send verification and sign out
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        setUser(null);
        return;
      }
      setUser(userCredential.user);
    } catch (error) {
      await signOut(auth);
      setUser(null);
    }
  };

  // Handle logout for admin
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    setAdminEmail("");
    setAdminPassword("");
    setIsAdmin(false);
  };

  // Handle sending a reply as admin
  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedUser) return;
    await addDoc(collection(db, "chats"), {
      text: reply,
      sender: selectedUser,
      isAdmin: true,
      createdAt: serverTimestamp()
    });
    setReply("");
  };

  // Show login form if not logged in
  if (!user) {
    return (
      <div className="max-w-xs mx-auto mt-20 p-6 bg-black border border-green-700 rounded-lg text-green-400 matrix-border matrix-glow">
        <h2 className="text-xl font-bold mb-4 text-green-400 text-shadow-green">Admin Login</h2>
        <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
          <input
            type="email"
            className="p-2 rounded bg-black text-green-400 border border-green-700 placeholder-green-700 matrix-glow"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            required
            style={{ textShadow: "0 0 8px #00ff41" }}
          />
          <input
            type="password"
            className="p-2 rounded bg-black text-green-400 border border-green-700 placeholder-green-700 matrix-glow"
            placeholder="Password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            required
            style={{ textShadow: "0 0 8px #00ff41" }}
          />
          <button
            type="submit"
            className="bg-green-700 text-black px-3 py-2 rounded font-bold matrix-glow"
            style={{ boxShadow: "0 0 8px #00ff41" }}
          >
            Login
          </button>
        </form>
        <style>
          {`
            .matrix-glow {
              box-shadow: 0 0 8px #00ff41, 0 0 2px #00ff41;
            }
            .matrix-border {
              border: 2px solid #00ff41 !important;
            }
            .text-shadow-green {
              text-shadow: 0 0 8px #00ff41, 0 0 2px #00ff41;
            }
          `}
        </style>
      </div>
    );
  }

  // Show error instead of messages if not admin, but allow login
  if (user && !isAdmin) {
    return (
      <div className="max-w-xs mx-auto mt-20 p-6 bg-black border border-green-700 rounded-lg text-green-400 matrix-border matrix-glow">
        <h2 className="text-xl font-bold mb-4 text-green-400 text-shadow-green">Admin Chat Panel</h2>
        <div className="text-red-400 mb-4">{"Access denied: Not an admin account."}</div>
        <div className="flex items-center gap-4">
          <span className="text-base font-bold text-green-300 break-all">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white px-3 py-1 rounded font-semibold matrix-glow"
            style={{ boxShadow: "0 0 8px #00ff41" }}
          >
            Logout
          </button>
        </div>
        <style>
          {`
            .matrix-glow {
              box-shadow: 0 0 8px #00ff41, 0 0 2px #00ff41;
            }
            .matrix-border {
              border: 2px solid #00ff41 !important;
            }
            .text-shadow-green {
              text-shadow: 0 0 8px #00ff41, 0 0 2px #00ff41;
            }
          `}
        </style>
      </div>
    );
  }

  // Admin panel UI
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-black border border-green-700 rounded-lg text-green-400 matrix-border matrix-glow font-mono"
      style={{
        boxShadow: "0 0 24px #00ff41, 0 0 8px #003b1a",
        border: "2px solid #00ff41"
      }}
    >
      {/* Header with admin email and logout */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-400 text-shadow-green">Admin Chat Panel</h2>
        <div className="flex items-center gap-4">
          <span className="text-base font-bold text-green-300 break-all">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white px-3 py-1 rounded font-semibold matrix-glow"
            style={{ boxShadow: "0 0 8px #00ff41" }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        {/* User list */}
        <div>
          <h3 className="font-semibold mb-2 text-green-400 text-shadow-green">Users</h3>
          <ul>
            {users.map(userEmail => (
              <li key={userEmail}>
                <button
                  className={`px-2 py-1 rounded matrix-glow ${selectedUser === userEmail ? "bg-green-700 text-white" : "bg-gray-800 text-green-400"}`}
                  onClick={() => setSelectedUser(userEmail)}
                  style={{ textShadow: "0 0 8px #00ff41" }}
                >
                  {userEmail}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-2 matrix-scroll"
            style={{
              maxHeight: 300,
              background: "linear-gradient(180deg, #001a0a 0%, #003b1a 100%)"
            }}
          >
            {selectedUser ? (
              chat
                .filter(m => m.sender === selectedUser || (m.isAdmin && m.sender === selectedUser))
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 ${msg.isAdmin ? "text-green-300 text-right" : "text-green-400 text-left"}`}
                    style={{ textShadow: "0 0 8px #00ff41" }}
                  >
                    <span className="block text-base font-semibold text-green-700">
                      {msg.isAdmin ? "Admin" : msg.sender}
                    </span>
                    <span className="inline-block bg-black bg-opacity-70 px-2 py-1 rounded border border-green-900 matrix-glow text-lg">
                      {msg.text}
                    </span>
                  </div>
                ))
            ) : (
              <div className="text-gray-400">Select a user to view chat.</div>
            )}
            {/* Dummy div for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
          {/* Reply input for admin */}
          {selectedUser && (
            <form onSubmit={sendReply} className="flex gap-2 mt-2">
              <input
                className="flex-1 p-1 rounded bg-black text-green-400 border border-green-700 matrix-glow"
                placeholder="Type a reply..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                required
                style={{ textShadow: "0 0 8px #00ff41" }}
              />
              <button
                type="submit"
                className="bg-green-700 text-black px-3 py-1 rounded font-bold matrix-glow"
                disabled={!reply.trim()}
                style={{ boxShadow: "0 0 8px #00ff41" }}
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
      {/* Matrix theme styles */}
      <style>
        {`
          .matrix-glow {
            box-shadow: 0 0 8px #00ff41, 0 0 2px #00ff41;
          }
          .matrix-border {
            border: 2px solid #00ff41 !important;
          }
          .matrix-scroll::-webkit-scrollbar {
            width: 6px;
            background: #001a0a;
          }
          .matrix-scroll::-webkit-scrollbar-thumb {
            background: #00ff41;
            border-radius: 3px;
          }
          .text-shadow-green {
            text-shadow: 0 0 8px #00ff41, 0 0 2px #00ff41;
          }
        `}
      </style>
    </div>
  );
};

export default AdminChatPanel;