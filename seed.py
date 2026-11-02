"""নমুনা ডেটা ও অ্যাডমিন অ্যাকাউন্ট তৈরি করে।  চালান:  python seed.py"""
import sys

import models
from auth import hash_password
from database import Base, SessionLocal, engine

ADMIN_EMAIL = "admin@shop.com"
ADMIN_PASSWORD = "admin123"  # চালু করার আগে অবশ্যই বদলাবেন

PRODUCTS = [
    # name, desc, price, stock, sizes, category slug, color(placeholder), image
    ("ক্লাসিক সাদা সুতি পাঞ্জাবি", "আরামদায়ক খাঁটি সুতির পাঞ্জাবি, ঈদ ও জুমার জন্য সেরা।", 1450, 25, "M,L,XL,XXL", "panjabi", "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600"),
    ("নেভি ব্লু এমব্রয়ডারি পাঞ্জাবি", "গলায় ও হাতায় সূক্ষ্ম এমব্রয়ডারির কাজ।", 2250, 18, "M,L,XL", "panjabi", ""),
    ("মেরুন সিল্ক ব্লেন্ড পাঞ্জাবি", "উৎসব ও বিয়ের জন্য রাজকীয় মেরুন রঙ।", 2890, 12, "L,XL,XXL", "panjabi", ""),
    ("ডার্ক গ্রিন কটন পাঞ্জাবি", "প্রতিদিনের ব্যবহারের জন্য নরম কটন।", 1650, 30, "M,L,XL", "panjabi", ""),
    ("কালো নিদা বোরকা (ক্লাসিক)", "হালকা ও আরামদায়ক নিদা কাপড়, সাথে হিজাব ও নেকাব।", 2450, 20, "52,54,56,58", "borka", ""),
    ("নেভি ব্লু আবায়া স্টাইল বোরকা", "সামনে খোলা আবায়া কাট, পাথরের কাজ করা হাতা।", 3350, 14, "52,54,56", "borka", ""),
    ("বাটারফ্লাই কাট বোরকা (ব্ল্যাক)", "প্রিমিয়াম জর্জেট, ঢিলেঢালা বাটারফ্লাই কাট।", 3850, 10, "54,56,58", "borka", ""),
    ("ডাবল লেয়ার হিজাব সেট", "বোরকার সাথে মানানসই প্রিমিয়াম হিজাব।", 650, 60, "Free", "borka", ""),
]


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(models.Category).first():
            db.add_all([
                models.Category(name="পাঞ্জাবি", slug="panjabi"),
                models.Category(name="বোরকা", slug="borka"),
            ])
            db.commit()
        cats = {c.slug: c.id for c in db.query(models.Category).all()}

        if not db.query(models.Product).first():
            for name, desc, price, stock, sizes, slug, img in PRODUCTS:
                db.add(models.Product(
                    name=name, description=desc, price=price, stock=stock,
                    sizes=sizes, category_id=cats[slug], image_url=img,
                ))
            db.commit()

        if not db.query(models.User).filter_by(email=ADMIN_EMAIL).first():
            db.add(models.User(
                name="Admin", email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD), is_admin=True,
            ))
            db.commit()
        print("Seed সম্পন্ন।")
        print(f"অ্যাডমিন লগইন: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    sys.exit(main())
