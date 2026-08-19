import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "messages.json");

// آماده‌سازی فایل ذخیره پیام‌ها در صورت عدم وجود
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
}

const getMessages = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading messages:", err);
    return [];
  }
};

const saveMessages = (messages) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving messages:", err);
  }
};

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "amiraftor";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "amir431229";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_amir";

app.use(cors({
  origin: "*", // یا برای امنیت بیشتر می‌تونی فقط آدرس فرانتت رو بذاری
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// تست سلامت سرور
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio Backend is running smoothly!" });
});

// ۱. دریافت پیام از فرم کانتکت
app.post("/contact", (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "لطفاً تمام فیلدها را پر کنید." });
    }

    const newMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
      replies: []
    };

    const messages = getMessages();
    messages.unshift(newMessage);
    saveMessages(messages);

    return res.status(201).json({
      success: true,
      message: "پیام شما با موفقیت ارسال شد!",
      data: newMessage
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    return res.status(500).json({ error: "خطایی در ثبت پیام رخ داد." });
  }
});

// Middleware برای احراز هویت توکن ادمین
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "دسترسی غیرمجاز: لطفاً وارد شوید." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "توکن نامعتبر یا منقضی شده است." });
    }
    req.user = user;
    next();
  });
};

// ۲. ورود ادمین
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({
      success: true,
      token,
      user: { username: ADMIN_USERNAME }
    });
  }

  return res.status(401).json({ error: "نام کاربری یا رمز عبور اشتباه است." });
});

// ۳. دریافت لیست همه پیام‌ها (فقط برای ادمین لاگین شده)
app.get("/admin/messages", authenticateToken, (req, res) => {
  const messages = getMessages();
  res.json({ success: true, messages });
});

// ۴. تغییر وضعیت خوانده شده / علامت‌گذاری پیام
app.put("/admin/messages/:id/read", authenticateToken, (req, res) => {
  const { id } = req.params;
  const messages = getMessages();
  const index = messages.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "پیام یافت نشد." });
  }

  messages[index].read = req.body.read !== undefined ? req.body.read : true;
  saveMessages(messages);

  res.json({ success: true, message: messages[index] });
});

// ۵. پاسخ دادن به پیام
app.post("/admin/messages/:id/reply", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText || !replyText.trim()) {
    return res.status(400).json({ error: "متن پاسخ نمی‌تواند خالی باشد." });
  }

  const messages = getMessages();
  const index = messages.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "پیام یافت نشد." });
  }

  const replyObj = {
    id: Date.now().toString(),
    text: replyText.trim(),
    createdAt: new Date().toISOString()
  };

  if (!messages[index].replies) {
    messages[index].replies = [];
  }

  messages[index].replies.push(replyObj);
  messages[index].read = true;
  saveMessages(messages);

  // در صورت کانفیگ بودن SMTP، ارسال ایمیل واقعی به کاربر
  let emailSent = false;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Amir Portfolio" <${process.env.EMAIL_USER}>`,
        to: messages[index].email,
        subject: `پاسخ به پیام شما: ${messages[index].name}`,
        html: `
          <div dir="rtl" style="font-family: Tahoma, sans-serif; line-height: 1.6; color: #333;">
            <p>سلام ${messages[index].name} عزیز،</p>
            <p>در پاسخ به پیام شما:</p>
            <blockquote style="background: #f4f4f4; padding: 10px; border-right: 4px solid #c8a96e; margin: 10px 0;">
              ${messages[index].message}
            </blockquote>
            <p><strong>پاسخ امیر:</strong></p>
            <p style="white-space: pre-wrap;">${replyText}</p>
            <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
            <small style="color: #888;">این پیام از طریق سایت شخصی امیر ارسال شده است.</small>
          </div>
        `
      });
      emailSent = true;
    } catch (mailErr) {
      console.warn("Could not send email automatically (check SMTP config):", mailErr.message);
    }
  }

  res.json({
    success: true,
    message: "پاسخ با موفقیت ثبت شد!",
    emailSent,
    reply: replyObj,
    updatedMessage: messages[index]
  });
});

// ۶. حذف پیام
app.delete("/admin/messages/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const messages = getMessages();
  const filtered = messages.filter((m) => m.id !== id);

  if (filtered.length === messages.length) {
    return res.status(404).json({ error: "پیام یافت نشد." });
  }

  saveMessages(filtered);
  res.json({ success: true, message: "پیام حذف شد." });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio backend running on http://localhost:${PORT}`);
});
