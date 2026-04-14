from app.core.database import engine, Base
from app.models.news import News
from app.models.announcement import Announcement
from app.models.registration import Registration

def init_db():
    print("创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")

if __name__ == "__main__":
    init_db()
