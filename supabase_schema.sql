-- ==============================================================================
-- 🚀 کدهای SQL برای ساخت جدول و تنظیمات Supabase (بدون نیاز به سرور)
-- این کدها را کپی کرده و در بخش SQL Editor پنل Supabase خود Run کنید.
-- ==============================================================================

-- ۱. ساخت جدول پیام‌های کانتکت
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  message text not null,
  read boolean default false not null,
  replies jsonb default '[]'::jsonb not null
);

-- ۲. ایجاد ایندکس برای افزایش سرعت جستجو و مرتب‌سازی
create index if not exists idx_messages_created_at on public.messages (created_at desc);
create index if not exists idx_messages_read on public.messages (read);

-- ۳. فعال‌سازی Row Level Security (RLS)
alter table public.messages enable row level security;

-- ۴. دسترسی ارسال پیام برای تمامی بازدیدکنندگان وب‌سایت (عمومی)
drop policy if exists "Anyone can insert contact message" on public.messages;
create policy "Anyone can insert contact message"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

-- ۵. دسترسی خواندن پیام‌ها برای پنل ادمین
drop policy if exists "Admin can read messages" on public.messages;
create policy "Admin can read messages"
  on public.messages
  for select
  to anon, authenticated
  using (true);

-- ۶. دسترسی ویرایش وضعیت خوانده شده یا افزودن پاسخ
drop policy if exists "Admin can update messages" on public.messages;
create policy "Admin can update messages"
  on public.messages
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- ۷. دسترسی حذف پیام برای ادمین
drop policy if exists "Admin can delete messages" on public.messages;
create policy "Admin can delete messages"
  on public.messages
  for delete
  to anon, authenticated
  using (true);

-- ۸. فعال‌سازی Realtime برای دریافت آنی پیام‌ها بدون ریفرش صفحه
alter publication supabase_realtime add table public.messages;
