from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:postgres123@localhost/career_axis"

engine = create_engine(DATABASE_URL)
