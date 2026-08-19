# راهنمای دیپلوی روی Railway (رایگان و سریع)

این پروژه شامل دو بخش است:
1. **Frontend**: پروژه React/Vite
2. **Backend**: پروژه Express در پوشه `server`

---

## 🚀 روش اول: دیپلوی بک‌اند از طریق گیت‌هاب (پیشنهادی)

1. کل پروژه‌تان را روی یک مخزن (Repository) در GitHub قرار دهید (`git push`).
2. وارد سایت [railway.com](https://railway.com) شوید و با اکانت GitHub خود وارد شوید.
3. روی **New Project** کلیک کنید و گزینه **Deploy from GitHub repo** را انتخاب کنید.
4. ریپازیتوری خود را انتخاب کنید.
5. وارد بخش تنظیمات پروژه (**Settings**) در Railway شوید:
   - در بخش **Root Directory** مقدار را برابر با `server` قرار دهید (چون بک‌اند داخل پوشه server است).
   - در صورت نیاز در بخش **Start Command** مقدار `node server.js` را وارد کنید.
6. وارد تب **Variables** در Railway شوید و متغیرهای زیر را تعریف کنید:
   - `PORT`: `5000` (اختیاری است، خود ریل‌وی ست می‌کند)
   - `ADMIN_USERNAME`: `amiraftor`
   - `ADMIN_PASSWORD`: `amir431229`
   - `JWT_SECRET`: یک رشته رندوم طولانی
   - `EMAIL_USER`: (اختیاری - جیمیل شما برای ارسال خودکار جواب به کاربر)
   - `EMAIL_PASS`: (اختیاری - App Password جیمیل شما)
7. وارد تب **Networking** شوید و روی **Generate Domain** کلیک کنید تا یک دامنه عمومی به شما بدهد (مثلاً `https://portfolio-backend-production-xxx.up.railway.app`).
8. حالا این دامنه به همراه `/contact` یا `/admin` آدرس API های شماست!

---

## 💻 ست کردن آدرس در پروژه فرانت‌اند

در ریشه پروژه فرانت‌اند، فایلی به نام `.env` بسازید یا آدرس سرور ریل‌وی را در `src/config/api.js` قرار دهید:
```env
VITE_API_URL=https://portfolio-backend-production-xxx.up.railway.app
```
(یا هر دامنه‌ای که ریل‌وی به شما داد).
