from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Shift(Base):
    __tablename__ = "shifts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    start = Column(String(10), nullable=False)
    end = Column(String(10), nullable=False)
    color = Column(String(20), nullable=False)

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    symbol = Column(String(20), nullable=False)
    description = Column(String(255))
