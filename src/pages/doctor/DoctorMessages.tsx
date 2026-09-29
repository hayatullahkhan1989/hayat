import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
  Clock,
  CheckCheck,
  Mail,
  Check,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/data/seed';

interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  text: string;
  time: string;
}

export default function DoctorMessages() {
  const { currentUser, contactMessages, addNotification, appointments } = useApp();
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<string>('pat1');
  const [replyText, setReplyText] = useState('');
  const [sentToast, setSentToast] = useState(false);

  // Seed sample patient chat threads
  const [threads, setThreads] = useState<Record<string, { patientName: string; patientId: string; messages: ChatMessage[] }>>({
    pat1: {
      patientName: 'Aman',
      patientId: 'pat1',
      messages: [
        { id: 'm1', sender: 'patient', text: 'Hello Doctor, I had a question regarding the dosage for my blood pressure medicine.', time: '10:15 AM' },
        { id: 'm2', sender: 'doctor', text: 'Hello Aman, please take 1 tablet at night after meals. Are you experiencing any dizziness?', time: '10:22 AM' },
        { id: 'm3', sender: 'patient', text: 'No dizziness so far, feeling much better today. Thank you!', time: '10:30 AM' },
      ],
    },
    pat2: {
      patientName: 'Riya',
      patientId: 'pat2',
      messages: [
        { id: 'm4', sender: 'patient', text: 'Doctor, should I fast before my upcoming lab tests scheduled this Thursday?', time: 'Yesterday' },
        { id: 'm5', sender: 'doctor', text: 'Yes Riya, an 8-10 hour overnight fasting is required for lipid and blood sugar profiling.', time: 'Yesterday' },
      ],
    },
    pat3: {
      patientName: 'Karan',
      patientId: 'pat3',
      messages: [
        { id: 'm6', sender: 'patient', text: 'Good morning Dr., my back pain has slightly reduced after doing the exercises you suggested.', time: '2 days ago' },
      ],
    },
  });

  const activeThread = threads[selectedChat] || Object.values(threads)[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'doctor',
      text: replyText.trim(),
      time: 'Just now',
    };

    setThreads((prev) => ({
      ...prev,
      [selectedChat]: {
        ...prev[selectedChat],
        messages: [...prev[selectedChat].messages, newMsg],
      },
    }));

    // Trigger notification to the patient
    addNotification({
      userId: activeThread.patientId,
      message: `Dr. ${currentUser?.name || 'Physician'} replied to your message.`,
      date: new Date().toISOString(),
      read: false,
    });

    setReplyText('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2500);
  };

  const filteredThreads = Object.entries(threads).filter(([_, th]) =>
    th.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Messages & Consultations</h1>
          <p className="text-sm text-gray-500">Communicate directly with your patients and answer queries</p>
        </div>

        {sentToast && (
          <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-700 flex items-center gap-2 animate-fade-in shadow-sm">
            <Check className="h-4 w-4" /> Message delivered and patient notified.
          </div>
        )}

        <div className="card overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[560px]">
          {/* Sidebar / Threads list */}
          <div className="border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patient chats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 text-xs"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
              {filteredThreads.map(([key, thread]) => {
                const lastMsg = thread.messages[thread.messages.length - 1];
                const isSelected = selectedChat === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedChat(key)}
                    className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-white border-l-4 border-l-primary-600 shadow-sm' : 'hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                      {thread.patientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 truncate">{thread.patientName}</p>
                        <span className="text-[11px] text-gray-400">{lastMsg?.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {lastMsg ? `${lastMsg.sender === 'doctor' ? 'You: ' : ''}${lastMsg.text}` : 'No messages'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation */}
          <div className="lg:col-span-2 flex flex-col h-full bg-white">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold">
                      {activeThread.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{activeThread.patientName}</h3>
                      <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span> Patient active
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Secure Healthcare Messaging</span>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/40">
                  {activeThread.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'doctor' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          m.sender === 'doctor'
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}
                      >
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                  <input
                    type="text"
                    placeholder={`Reply to ${activeThread.patientName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button type="submit" className="btn-primary shrink-0" disabled={!replyText.trim()}>
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                <p>Select a patient to start conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
