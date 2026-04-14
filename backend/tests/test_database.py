import pytest
from sqlalchemy import text
from app.core.database import engine

def test_database_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            assert result.fetchone()[0] == 1
    except Exception as e:
        pytest.fail(f"数据库连接失败: {e}")
