/* global chrome */
import { useState, useEffect } from 'react';
import api from "./config/axios.js"
import GetStarted from './component/GetStarted.jsx';
import Form from './component/Form.jsx';
import EmailView from './component/EmailView.jsx';
import AiResult from './component/AiResult.jsx';
import MenuView from './component/MenuView.jsx';

function App() {
  const [view, setView] = useState('menu');

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("")
  const [aiResult, setAiResult] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  })

  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "pending",
    jobType: "full-time",
    link: "",
    jobLocation: "Unknown"
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/user/info");
        if (response.status === 200) {
          const data = await response.data;
          setAuthState({ isLoading: false, isAuthenticated: true, user: data });
        } else {
          setAuthState({ isLoading: false, isAuthenticated: false, user: null });
        }
      } catch (error) {
        console.error("Auth check failed (Server likely down):", error);
        setAuthState({ isLoading: false, isAuthenticated: false, user: null });
      }
    };
    checkAuth();
  }, []);

  // --- Auto-Fill Link on Load ---
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          setForm(prev => ({ ...prev, link: tabs[0].url }));
        }
      });
    }
  }, []);

  if (authState.isLoading) {
    return (
      <div className="w-75 h-100 flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <GetStarted />
  }

  return (
    <div className="p-5 bg-gray-950 h-150 w-87.5 text-white font-sans overflow-y-auto custom-scrollbar">
      {view === 'menu' && <MenuView setForm={setForm} setMessage={setMessage} loading={loading} setLoading={setLoading} setDescription={setDescription} view={view} setView={setView} setAiResult={setAiResult} setEmailData={setEmailData} setAuthState={setAuthState} />}
      {view === 'manual' && <Form form={form} setForm={setForm} message={message} setMessage={setMessage} loading={loading} setLoading={setLoading} description={description} setDescription={setDescription} setView={setView} />}
      {view === 'ai-result' && <AiResult setView={setView} aiResult={aiResult} />}
      {view === 'email-result' && <EmailView setView={setView} emailData={emailData}/>}
    </div>
  );
}

export default App;