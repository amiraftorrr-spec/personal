import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPaperPlane,
  FaSignOutAlt,
  FaTrash,
  FaCheckCircle,
  FaRegCircle,
  FaReply,
  FaClock,
  FaUser,
  FaLock,
  FaArrowRight,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaInbox,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { API_BASE_URL } from "../config/api";

export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'unread', 'read'

  // بررسی ورود و دریافت پیام‌ها
  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "نام کاربری یا رمز عبور اشتباه است.");
      }

      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setUsername("");
      setPassword("");
    } catch (err) {
      setLoginError(err.message || "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setMessages([]);
    setSelectedMessage(null);
  };

  const fetchMessages = async () => {
    setFetchingMessages(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        if (selectedMessage) {
          const updated = (data.messages || []).find((m) => m.id === selectedMessage.id);
          if (updated) setSelectedMessage(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setFetchingMessages(false);
    }
  };

  const toggleReadStatus = async (id, currentStatus, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentStatus } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => ({ ...prev, read: !currentStatus }));
        }
      }
    } catch (err) {
      console.error("Error updating read status:", err);
    }
  };

  const handleDeleteMessage = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("آیا از حذف این پیام مطمئن هستید؟")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setReplying(true);
    setReplySuccess("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/messages/${selectedMessage.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ replyText }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "خطا در ثبت پاسخ");
      }

      setReplySuccess(
        data.emailSent
          ? "پاسخ با موفقیت ثبت و ایمیل برای کاربر ارسال شد!"
          : "پاسخ ثبت شد (همچنین می‌توانید مستقیماً به ایمیل کاربر ارسال کنید)."
      );
      setReplyText("");

      if (data.updatedMessage) {
        setSelectedMessage(data.updatedMessage);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.updatedMessage.id ? data.updatedMessage : m
          )
        );
      }
    } catch (err) {
      alert(err.message || "مشکلی در ارسال پیش آمد");
    } finally {
      setReplying(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "unread") return matchesSearch && !m.read;
    if (filterType === "read") return matchesSearch && m.read;
    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  // ۱. فرم ورود در صورتی که توکن موجود نباشد
  if (!token) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-4 selection:bg-[#c8a96e] selection:text-black font-sans"
      >
        <div className="w-full max-w-md bg-[#161616] border border-[#c8a96e]/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* افکت نور طلایی */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c8a96e]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#c8a96e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <FaShieldAlt />
            </div>
            <h1 className="text-2xl font-bold text-[#f5efe6] tracking-wide">
              ورود به پنل مدیریت
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              مدیریت پیام‌ها و فرم تماس پورتفولیو امیر
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs text-neutral-300 mb-2 font-medium">
                نام کاربری
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="amiraftor"
                  className="w-full bg-[#202020] border border-neutral-700/60 focus:border-[#c8a96e] rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
                />
                <FaUser className="absolute right-3.5 top-3.5 text-neutral-500 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-300 mb-2 font-medium">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#202020] border border-neutral-700/60 focus:border-[#c8a96e] rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
                />
                <FaLock className="absolute right-3.5 top-3.5 text-neutral-500 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c8a96e] hover:bg-[#d8b97e] text-black font-semibold text-sm rounded-xl shadow-lg transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به پنل</span>
                  <FaArrowRight className="rotate-180 text-xs" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-neutral-800 pt-4">
            <Link
              to="/"
              className="text-xs text-[#c8a96e]/80 hover:text-[#c8a96e] transition flex items-center justify-center gap-1.5"
            >
              <FaArrowRight className="text-[10px]" />
              <span>بازگشت به وب‌سایت اصلی</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ۲. داشبورد مدیریت پیام‌ها
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0f0f0f] text-neutral-200 font-sans flex flex-col selection:bg-[#c8a96e] selection:text-black"
    >
      {/* هدر ادمین */}
      <header className="bg-[#161616] border-b border-neutral-800 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e] font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              پنل مدیریت پیام‌های امیر
              <span className="text-[10px] bg-[#c8a96e]/20 text-[#c8a96e] px-2 py-0.5 rounded-full border border-[#c8a96e]/30">
                Admin
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              پیام‌های دریافتی از فرم تماس وب‌سایت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-[#c8a96e] bg-[#222] hover:bg-[#282828] px-3.5 py-2 rounded-xl transition border border-neutral-700/50"
          >
            <span>مشاهده سایت</span>
            <FaExternalLinkAlt className="text-[10px]" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 px-3.5 py-2 rounded-xl transition"
          >
            <FaSignOutAlt className="text-xs" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* محتوای اصلی دو ستونه */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ستون راست: لیست پیام‌ها و فیلترها */}
        <div className="lg:col-span-5 flex flex-col bg-[#161616] border border-neutral-800 rounded-2xl overflow-hidden h-[calc(100vh-140px)] min-h-[500px]">
          {/* سرچ و فیلتر */}
          <div className="p-4 border-b border-neutral-800 bg-[#1a1a1a]/80 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در پیام‌ها، نام، ایمیل..."
                className="w-full bg-[#111] border border-neutral-700/70 focus:border-[#c8a96e] rounded-xl px-4 py-2.5 pr-9 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
              <FaSearch className="absolute right-3 top-3 text-neutral-500 text-xs" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-[#111] p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterType === "all"
                      ? "bg-[#c8a96e] text-black font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  همه ({messages.length})
                </button>
                <button
                  onClick={() => setFilterType("unread")}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                    filterType === "unread"
                      ? "bg-[#c8a96e] text-black font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>خوانده نشده</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setFilterType("read")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterType === "read"
                      ? "bg-[#c8a96e] text-black font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  خوانده شده
                </button>
              </div>

              <button
                onClick={fetchMessages}
                title="بروزرسانی لیست"
                className="text-xs text-neutral-400 hover:text-[#c8a96e] px-2 py-1 transition"
              >
                {fetchingMessages ? "در حال دریافت..." : "بروزرسانی ↻"}
              </button>
            </div>
          </div>

          {/* لیست پیام‌ها */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                <FaInbox className="text-4xl mb-3 text-neutral-600" />
                <p className="text-sm font-medium">هیچ پیامی یافت نشد</p>
                <p className="text-xs text-neutral-600 mt-1">
                  پیام‌های ارسالی کاربران از فرم سایت اینجا نمایش داده می‌شوند.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.read) toggleReadStatus(msg.id, false);
                    }}
                    className={`p-4 cursor-pointer transition flex flex-col gap-2 relative ${
                      isSelected
                        ? "bg-[#222222] border-r-4 border-[#c8a96e]"
                        : "hover:bg-[#1a1a1a]"
                    } ${!msg.read ? "bg-[#1f1a14]/40" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-[#c8a96e] animate-pulse"
                            title="خوانده نشده"
                          />
                        )}
                        <span className="font-semibold text-sm text-white">
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <FaClock className="text-[9px]" />
                        {new Date(msg.createdAt).toLocaleDateString("fa-IR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-[#c8a96e]/90 truncate">
                      {msg.email}
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-neutral-800/40 text-[11px]">
                      <span className="text-neutral-500">
                        {msg.replies && msg.replies.length > 0 ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <FaReply className="text-[9px]" />
                            {msg.replies.length} پاسخ داده شده
                          </span>
                        ) : (
                          <span className="text-neutral-500">بدون پاسخ</span>
                        )}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleReadStatus(msg.id, msg.read, e)}
                          title={
                            msg.read
                              ? "علامت‌گذاری به عنوان خوانده‌نشده"
                              : "علامت‌گذاری به عنوان خوانده‌شده"
                          }
                          className="p-1.5 text-neutral-400 hover:text-[#c8a96e] transition rounded-lg hover:bg-neutral-800"
                        >
                          {msg.read ? <FaCheckCircle /> : <FaRegCircle />}
                        </button>
                        <button
                          onClick={(e) => handleDeleteMessage(msg.id, e)}
                          title="حذف پیام"
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition rounded-lg hover:bg-neutral-800"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ستون چپ: جزئیات پیام و بخش پاسخ دادن */}
        <div className="lg:col-span-7 flex flex-col bg-[#161616] border border-neutral-800 rounded-2xl overflow-hidden h-[calc(100vh-140px)] min-h-[500px]">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* هدر پیام انتخابی */}
              <div className="p-5 border-b border-neutral-800 bg-[#1a1a1a] flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedMessage.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1.5">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-[#c8a96e] hover:underline flex items-center gap-1.5"
                    >
                      <FaEnvelope className="text-[11px]" />
                      {selectedMessage.email}
                    </a>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-[10px]" />
                      {new Date(selectedMessage.createdAt).toLocaleString(
                        "fa-IR"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=پاسخ به پیام شما&body=سلام ${selectedMessage.name} عزیز،%0D%0A%0D%0A`}
                    className="text-xs bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/30 px-3 py-1.5 rounded-xl hover:bg-[#c8a96e]/20 transition flex items-center gap-1.5"
                  >
                    <span>ایمیل مستقیم</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-neutral-400 hover:text-red-400 rounded-xl hover:bg-neutral-800 transition"
                    title="حذف پیام"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>

              {/* متن پیام و سابقه پاسخ‌ها */}
              <div className="flex-1 p-5 overflow-y-auto space-y-6">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                    متن پیام کاربر:
                  </label>
                  <div className="p-4 rounded-xl bg-[#202020] border border-neutral-700/60 text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap select-text">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* سوابق پاسخ‌ها */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#c8a96e] uppercase tracking-wider block">
                      پاسخ‌های ارسال شده شما ({selectedMessage.replies.length}):
                    </label>
                    {selectedMessage.replies.map((rep, idx) => (
                      <div
                        key={rep.id || idx}
                        className="p-4 rounded-xl bg-[#2a2418]/40 border border-[#c8a96e]/20 text-neutral-200 text-sm space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#c8a96e]">
                          <span className="font-semibold">پاسخ امیر</span>
                          <span>
                            {new Date(rep.createdAt).toLocaleString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
                          {rep.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* فرم ارسال پاسخ */}
              <div className="p-4 border-t border-neutral-800 bg-[#1a1a1a]">
                {replySuccess && (
                  <div className="mb-3 p-2.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-xl flex items-center justify-between">
                    <span>{replySuccess}</span>
                    <button
                      onClick={() => setReplySuccess("")}
                      className="text-neutral-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendReply} className="space-y-3">
                  <label className="block text-xs font-medium text-neutral-300">
                    پاسخ به {selectedMessage.name}:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`متن پاسخ خود را اینجا بنویسید (به ایمیل ${selectedMessage.email} نیز ثبت می‌شود)...`}
                    className="w-full bg-[#111] border border-neutral-700 focus:border-[#c8a96e] rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none transition resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-neutral-500">
                      پاسخ در پنل ذخیره شده و به ایمیل کاربر ایمیل می‌شود.
                    </p>
                    <button
                      type="submit"
                      disabled={replying || !replyText.trim()}
                      className="px-5 py-2.5 bg-[#c8a96e] hover:bg-[#d8b97e] text-black font-semibold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {replying ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaPaperPlane className="text-xs rotate-180" />
                          <span>ارسال پاسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-500">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800/50 flex items-center justify-center text-2xl text-neutral-600 mb-3">
                <FaReply />
              </div>
              <h3 className="text-base font-semibold text-neutral-400">
                پیامی انتخاب نشده است
              </h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm">
                برای مشاهده متن کامل پیام، اطلاعات تماس و ارسال پاسخ، یک پیام را از لیست سمت راست انتخاب کنید.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
