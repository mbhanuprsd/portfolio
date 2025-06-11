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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

const ChatWidget = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [email, setEmail] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [user, setUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, "chats"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, showChat]);

    useEffect(() => {
        if (user) {
            setEmailVerified(user.emailVerified);
        }
    }, [user]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const auth = getAuth();
        try {
            // Try to sign in, if fails, create account
            let userCredential;
            try {
                userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
            } catch {
                userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
                await sendEmailVerification(userCredential.user);
            }
            setUser(userCredential.user);
            setEmail(userCredential.user.email);
            if (!userCredential.user.emailVerified) {
                await sendEmailVerification(userCredential.user);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const refreshVerification = async () => {
        const auth = getAuth();
        await auth.currentUser.reload();
        setUser(auth.currentUser);
        setEmailVerified(auth.currentUser.emailVerified);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !email || !emailVerified) return;
        await addDoc(collection(db, "chats"), {
            text: input,
            sender: email,
            isAdmin: false,
            createdAt: serverTimestamp()
        });
        setInput("");
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 font-mono">
            {!showChat ? (
                <button
                    className="bg-black border border-green-700 text-green-400 px-4 py-2 rounded-full shadow-lg hover:bg-green-900 hover:text-black transition-all duration-200 matrix-glow"
                    onClick={() => setShowChat(true)}
                    style={{ fontFamily: "monospace", letterSpacing: "0.1em", textShadow: "0 0 8px #00ff41" }}
                >
                    <i className="fas fa-terminal mr-2" /> Chat with The One
                </button>
            ) : (
                <div
                    className="w-80 bg-black bg-opacity-95 border border-green-700 rounded-lg shadow-2xl flex flex-col matrix-border"
                    style={{
                        boxShadow: "0 0 24px #00ff41, 0 0 8px #003b1a",
                        border: "2px solid #00ff41"
                    }}
                >
                    <div className="flex justify-between items-center p-2 border-b border-green-700 bg-black bg-opacity-80">
                        <span className="font-bold text-green-400 tracking-widest text-shadow-green">
                            <i className="fas fa-user-secret mr-2" />
                            Chat with The One
                        </span>
                        <button
                            className="text-green-400 hover:text-red-400 font-bold text-lg"
                            onClick={() => setShowChat(false)}
                            title="Close"
                        >
                            ×
                        </button>
                    </div>
                    <div
                        className="flex-1 overflow-y-auto p-2 matrix-scroll"
                        style={{
                            maxHeight: 300,
                            background: "linear-gradient(180deg, #001a0a 0%, #003b1a 100%)"
                        }}
                    >
                        {messages
                            .filter(
                                (msg) =>
                                    msg.sender === email || (msg.isAdmin && msg.sender === email)
                            )
                            .map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`mb-2 ${msg.isAdmin
                                        ? "text-green-300 text-right"
                                        : "text-green-400 text-left"
                                        }`}
                                    style={{
                                        textShadow: "0 0 8px #00ff41",
                                    }}
                                >
                                    <span className="block text-base font-semibold text-green-700">
                                        {msg.isAdmin ? "Admin" : msg.sender}
                                    </span>
                                    <span className="inline-block bg-black bg-opacity-70 px-2 py-1 rounded border border-green-900 matrix-glow text-lg">
                                        {msg.text}
                                    </span>
                                </div>
                            ))}
                        <div ref={messagesEndRef} />
                    </div>
                    {!user ? (
                        <form onSubmit={handleEmailSubmit} className="p-2 border-t border-green-700 flex flex-col gap-2">
                            <input
                                className="p-1 rounded bg-black text-green-400 border border-green-700 placeholder-green-700 matrix-glow"
                                placeholder="Enter your email"
                                type="email"
                                value={emailInput}
                                onChange={e => setEmailInput(e.target.value)}
                                required
                                autoFocus
                                style={{ textShadow: "0 0 8px #00ff41" }}
                            />
                            <input
                                className="p-1 rounded bg-black text-green-400 border border-green-700 placeholder-green-700 matrix-glow"
                                placeholder="Enter a password"
                                type="password"
                                value={passwordInput}
                                onChange={e => setPasswordInput(e.target.value)}
                                required
                                style={{ textShadow: "0 0 8px #00ff41" }}
                            />
                            <button
                                type="submit"
                                className="bg-green-700 text-black px-3 py-1 rounded font-bold matrix-glow"
                                disabled={!emailInput.trim() || !passwordInput.trim()}
                                style={{ boxShadow: "0 0 8px #00ff41" }}
                            >
                                Continue
                            </button>
                            {error && <div className="text-red-400 text-xs">{error}</div>}
                        </form>
                    ) : !emailVerified ? (
                        <div className="p-2 border-t border-green-700 flex flex-col gap-2">
                            <div className="text-yellow-400 text-sm mb-2">
                                Please verify your email address. Check your inbox and click the verification link.
                            </div>
                            <button
                                className="bg-green-700 text-black px-3 py-1 rounded font-bold matrix-glow"
                                onClick={refreshVerification}
                                style={{ boxShadow: "0 0 8px #00ff41" }}
                            >
                                I've Verified My Email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={sendMessage} className="p-2 border-t border-green-700 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 p-1 rounded bg-black text-green-400 border border-green-700 placeholder-green-700 matrix-glow"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    required
                                    autoFocus
                                    style={{ textShadow: "0 0 8px #00ff41" }}
                                />
                                <button
                                    type="submit"
                                    className="bg-green-700 text-black px-3 py-1 rounded font-bold matrix-glow"
                                    disabled={!input.trim()}
                                    style={{ boxShadow: "0 0 8px #00ff41" }}
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    )}
                    {/* Logout button for authenticated user */}
                    {user && emailVerified && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-base font-bold text-green-300 break-all">{email}</span>
                            <button
                                className="bg-black border border-green-700 text-green-400 px-3 py-1 rounded font-bold matrix-glow hover:bg-green-900 hover:text-black transition-all duration-200"
                                onClick={async () => {
                                    const auth = getAuth();
                                    await auth.signOut();
                                    setUser(null);
                                    setEmail("");
                                    setEmailInput("");
                                    setPasswordInput("");
                                    setEmailVerified(false);
                                    setInput("");
                                }}
                                style={{ boxShadow: "0 0 8px #00ff41" }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
            {/* Matrix rain effect overlay */}
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

export default ChatWidget;