# নূর মডেস্ট শপ — পাঞ্জাবি ও বোরকার ই-কমার্স ওয়েবসাইট

- **Backend:** Python, FastAPI, SQLAlchemy, MySQL, JWT লগইন
- **Frontend:** HTML, Tailwind CSS (CDN), JavaScript

## যা যা আছে
- সাইন আপ / লগইন / লগআউট (পাসওয়ার্ড bcrypt দিয়ে সুরক্ষিত, JWT টোকেন)
- পাঞ্জাবি ও বোরকার ক্যাটাগরি, সার্চ, দাম অনুযায়ী সাজানো
- পণ্যের বিবরণ, সাইজ বাছাই, কার্ট (ব্রাউজারে সংরক্ষিত)
- চেকআউট (ক্যাশ অন ডেলিভারি), আমার অর্ডার পেজ
- অ্যাডমিন প্যানেল: পণ্য যোগ/এডিট/সরানো, অর্ডারের স্ট্যাটাস বদলানো
- সার্ভার নিজে দাম হিসাব করে ও স্টক কমায় (ক্লায়েন্টের দাম বিশ্বাস করে না)

## চালানোর নিয়ম (নিজের কম্পিউটারে, সম্পূর্ণ ফ্রি)

### ১. দরকারি সফটওয়্যার
Python 3.10+ এবং MySQL (XAMPP বা MySQL Community Server — দুটোই ফ্রি)।

### ২. ডাটাবেস বানান
MySQL এ ঢুকে চালান:
```sql
CREATE DATABASE modest_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ৩. Backend
```bash
cd backend
python -m venv venv
# Windows:  venv\Scripts\activate      Mac/Linux:  source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # Windows এ: copy .env.example .env
# .env খুলে DATABASE_URL এ নিজের MySQL পাসওয়ার্ড বসান
python seed.py              # নমুনা পণ্য + অ্যাডমিন তৈরি
uvicorn main:app --reload --port 8000
```
API ডকুমেন্টেশন দেখুন: http://127.0.0.1:8000/docs

### ৪. Frontend
নতুন টার্মিনালে:
```bash
cd frontend
python -m http.server 5500
```
ব্রাউজারে খুলুন: http://localhost:5500

(VS Code এর "Live Server" দিয়েও চলবে। পোর্ট ৫৫০০ বা ৫৫০১ হলে `.env` এর `CORS_ORIGINS` মিলিয়ে নিন।)

### অ্যাডমিন লগইন
`admin@shop.com` / `admin123` — **চালু করার আগে অবশ্যই বদলাবেন** (`seed.py` এ বদলে আবার চালান, অথবা ডাটাবেসে সরাসরি)।
`.env` এর `SECRET_KEY` ও লম্বা র‍্যান্ডম কিছু দিন।

## অনলাইনে দেওয়া (ফ্রি অপশন)
ফ্রি প্ল্যানের শর্ত সময়ের সাথে বদলায়, তাই দেওয়ার আগে তাদের সাইটে দেখে নিন।
- **Frontend:** Netlify, Cloudflare Pages বা GitHub Pages (স্ট্যাটিক ফাইল, ফ্রি)
- **Backend (FastAPI):** Render, Railway ইত্যাদির ফ্রি/ট্রায়াল প্ল্যান (ফ্রিতে সার্ভার ঘুমিয়ে যেতে পারে, প্রথম রিকোয়েস্ট ধীর হয়)
- **MySQL:** Aiven বা TiDB Cloud এর ফ্রি টিয়ার (সীমিত স্টোরেজ)
- নিজের ডোমেইন (যেমন `.com`) কিনতে বছরে টাকা লাগবে। ফ্রি সাবডোমেইন পাবেন।

হোস্ট করলে `frontend/js/app.js` এর `API_BASE` লাইনে ব্যাকএন্ডের আসল ঠিকানা বসাবেন, আর `.env` এ `CORS_ORIGINS` এ ফ্রন্টএন্ডের ঠিকানা দেবেন।

## পরের ধাপে যোগ করা যায়
bKash/Nagad পেমেন্ট, ছবি আপলোড, কুপন, রিভিউ, পাসওয়ার্ড রিসেট ইমেইল।
