import { supabase, isSupabaseConfigured } from "../config/supabase.js";
import { API_BASE_URL } from "../config/api.js";

const ADMIN_USERNAME = import.meta.env?.VITE_ADMIN_USERNAME || "amiraftor";
const ADMIN_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || "amir431229";

// نرمال‌سازی فیلدهای پیام برای سازگاری بین Supabase و Express
const normalizeMessage = (msg) => {
  if (!msg) return null;
  return {
    ...msg,
    id: String(msg.id),
    createdAt: msg.createdAt || msg.created_at || new Date().toISOString(),
    read: Boolean(msg.read),
    replies: Array.isArray(msg.replies) ? msg.replies : [],
  };
};

/**
 * ۱. ارسال پیام از طریق فرم کانتکت
 */
export async function submitContactMessage({ name, email, message }) {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  const trimmedMessage = message?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    throw new Error("لطفاً تمامی فیلدها را پر کنید.");
  }

  // اگر سوپابیس ست شده باشد (حالت سرورلس بدون نیاز به سرور)
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          read: false,
          replies: [],
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message || "خطا در ثبت پیام در پایگاه داده");
    }

    return {
      success: true,
      message: "پیام شما با موفقیت ارسال شد!",
      data: data?.[0] ? normalizeMessage(data[0]) : null,
    };
  }

  // در غیر این صورت استفاده از سرور Express به عنوان فال‌بک
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "ارسال پیام با خطا مواجه شد.");
  }

  return {
    success: true,
    message: data?.message || "پیام شما با موفقیت ارسال شد!",
    data: data?.data ? normalizeMessage(data.data) : null,
  };
}

/**
 * ۲. ورود ادمین (نام کاربری: amiraftor | رمز عبور: amir431229)
 */
export async function adminLogin(username, password) {
  const user = username?.trim();
  const pass = password?.trim();

  // اگر سوپابیس فعال باشد، نیازی به بکند نودجی‌اس نیست
  if (isSupabaseConfigured) {
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      // ساخت یک توکن اعتبارسنجی لوکال برای نشست ادمین
      const sessionToken = btoa(
        JSON.stringify({
          user: ADMIN_USERNAME,
          role: "admin",
          loginAt: Date.now(),
        })
      );
      return {
        success: true,
        token: sessionToken,
        user: { username: ADMIN_USERNAME },
      };
    }
    throw new Error("نام کاربری یا رمز عبور اشتباه است.");
  }

  // فال‌بک به سرور Express در صورت فعال بودن
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "نام کاربری یا رمز عبور اشتباه است.");
  }

  return data;
}

/**
 * ۳. دریافت لیست همه پیام‌ها
 */
export async function getAdminMessages(token) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw new Error(error.message || "خطا در دریافت پیام‌ها از دیتابیس");
    }

    return {
      success: true,
      messages: (data || []).map(normalizeMessage),
    };
  }

  // فال‌بک به Express
  const res = await fetch(`${API_BASE_URL}/admin/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "خطا در دریافت پیام‌ها");
  }

  return {
    success: true,
    messages: (data?.messages || []).map(normalizeMessage),
  };
}

/**
 * ۴. تغییر وضعیت خوانده‌شده / خوانده‌نشده
 */
export async function toggleMessageRead(id, currentStatus, token) {
  if (isSupabaseConfigured && supabase) {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from("messages")
      .update({ read: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(error.message);
    }

    return { success: true, read: newStatus };
  }

  // فال‌بک به Express
  const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ read: !currentStatus }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "خطا در به‌روزرسانی پیام");
  }

  return data;
}

/**
 * ۵. حذف پیام
 */
export async function deleteAdminMessage(id, token) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(error.message);
    }

    return { success: true };
  }

  // فال‌بک به Express
  const res = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "خطا در حذف پیام");
  }

  return data;
}

/**
 * ۶. ثبت پاسخ به پیام
 */
export async function replyToAdminMessage(id, replyText, currentMessage, token) {
  if (!replyText?.trim()) {
    throw new Error("متن پاسخ نمی‌تواند خالی باشد.");
  }

  const replyObj = {
    id: String(Date.now()),
    text: replyText.trim(),
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const updatedReplies = [
      ...(Array.isArray(currentMessage?.replies) ? currentMessage.replies : []),
      replyObj,
    ];

    const { error } = await supabase
      .from("messages")
      .update({
        replies: updatedReplies,
        read: true,
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase reply error:", error);
      throw new Error(error.message);
    }

    return {
      success: true,
      reply: replyObj,
      updatedMessage: {
        ...currentMessage,
        read: true,
        replies: updatedReplies,
      },
      emailSent: false,
    };
  }

  // فال‌بک به Express
  const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ replyText }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "خطا در ثبت پاسخ");
  }

  return {
    ...data,
    updatedMessage: data.updatedMessage ? normalizeMessage(data.updatedMessage) : null,
  };
}

/**
 * ۷. گوش دادن به پیام‌های جدید به‌صورت ریل‌تایم (Realtime)
 */
export function subscribeToNewMessages(onNewMessage) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel("realtime-messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        if (typeof onNewMessage === "function") {
          onNewMessage(payload);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
