"""
Quick setup script to initialize/fix database schema
"""
from app.database.database import engine
from app.database.base import Base
# Import all models to register them with SQLAlchemy
from app.models import *
from sqlalchemy import text, inspect
import sys

def setup_database():
    print("Dropping all tables with CASCADE...")
    # Use raw SQL to drop all tables with CASCADE to handle dependencies
    with engine.begin() as connection:
        try:
            connection.execute(text("""
                DO $$ DECLARE
                    r RECORD;
                BEGIN
                    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                    END LOOP;
                END $$;
            """))
            print("All tables dropped successfully!")
        except Exception as e:
            print(f"Drop info: {e}")
    
    print("Creating all tables with updated schema...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database schema created successfully!")
    print("\n📋 Tables created:")
    inspector_obj = inspect(engine)
    for table_name in inspector_obj.get_table_names():
        print(f"  ✓ {table_name}")
        columns = inspector_obj.get_columns(table_name)
        for col in columns:
            print(f"    - {col['name']}: {col['type']}")

if __name__ == "__main__":
    try:
        setup_database()
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
