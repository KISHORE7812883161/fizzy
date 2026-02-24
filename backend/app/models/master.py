from sqlalchemy import Column, Integer, String, Text, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
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

class Workstation(Base):
    __tablename__ = "workstations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    shift_assignments = Column(JSON) # List of {shift_id, start_date, end_date}

class Process(Base):
    __tablename__ = "processes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    workstation_id = Column(Integer, ForeignKey("workstations.id"))
    process_time = Column(Float, default=0.0)
    setup_time = Column(Float, default=0.0)
    technical_values = Column(JSON) # List of {name, value, unit_id}

    workstation = relationship("Workstation")

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    type = Column(String(20)) # 'Main' or 'Sub'
    process_sequence = Column(JSON) # List of process_ids

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    main_route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)

    main_route = relationship("Route")
