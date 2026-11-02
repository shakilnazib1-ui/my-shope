import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:@localhost:3306/modest_shop",
)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif "tidbcloud.com" in DATABASE_URL:
    # TiDB Cloud এ TLS বাধ্যতামূলক; সিস্টেমের বিশ্বস্ত সার্টিফিকেট ব্যবহার হয়
    import ssl
    connect_args = {"ssl": ssl.create_default_context()}

# pool_recycle: TiDB অলস কানেকশন কেটে দেয়, তাই ৫ মিনিট পরপর কানেকশন নতুন করা হয়
engine = create_engine(
    DATABASE_URL, pool_pre_ping=True, pool_recycle=280, connect_args=connect_args
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
