from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from app.core.database import engine, Base, get_db
from app.models.master import Shift as ShiftModel, Unit as UnitModel
from pydantic import BaseModel, ConfigDict

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fizzy Manufacturing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas
class ShiftBase(BaseModel):
    title: str
    start: str
    end: str
    color: str

class ShiftCreate(ShiftBase):
    pass

class Shift(ShiftBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UnitBase(BaseModel):
    name: str
    symbol: str
    description: str

class UnitCreate(UnitBase):
    pass

class Unit(UnitBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Shift Endpoints
@app.get("/api/shifts", response_model=List[Shift])
def get_shifts(db: Session = Depends(get_db)):
    return db.query(ShiftModel).all()

@app.post("/api/shifts", response_model=Shift)
def create_shift(shift: ShiftCreate, db: Session = Depends(get_db)):
    db_shift = ShiftModel(
        title=shift.title, 
        start=shift.start, 
        end=shift.end, 
        color=shift.color
    )
    db.add(db_shift)
    db.commit()
    db.refresh(db_shift)
    return db_shift

@app.put("/api/shifts/{shift_id}", response_model=Shift)
def update_shift(shift_id: int, shift: ShiftCreate, db: Session = Depends(get_db)):
    db_shift = db.query(ShiftModel).filter(ShiftModel.id == shift_id).first()
    if not db_shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    db_shift.title = shift.title
    db_shift.start = shift.start
    db_shift.end = shift.end
    db_shift.color = shift.color
    
    db.commit()
    db.refresh(db_shift)
    return db_shift

@app.delete("/api/shifts/{shift_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shift(shift_id: int, db: Session = Depends(get_db)):
    db_shift = db.query(ShiftModel).filter(ShiftModel.id == shift_id).first()
    if not db_shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    db.delete(db_shift)
    db.commit()
    return None

# Unit Endpoints
@app.get("/api/units", response_model=List[Unit])
def get_units(db: Session = Depends(get_db)):
    return db.query(UnitModel).all()

@app.post("/api/units", response_model=Unit)
def create_unit(unit: UnitCreate, db: Session = Depends(get_db)):
    db_unit = UnitModel(**unit.dict())
    db.add(db_unit)
    db.commit()
    db.refresh(db_unit)
    return db_unit

@app.put("/api/units/{unit_id}", response_model=Unit)
def update_unit(unit_id: int, unit: UnitCreate, db: Session = Depends(get_db)):
    db_unit = db.query(UnitModel).filter(UnitModel.id == unit_id).first()
    if not db_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    for key, value in unit.dict().items():
        setattr(db_unit, key, value)
    
    db.commit()
    db.refresh(db_unit)
    return db_unit

@app.delete("/api/units/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unit(unit_id: int, db: Session = Depends(get_db)):
    db_unit = db.query(UnitModel).filter(UnitModel.id == unit_id).first()
    if not db_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(db_unit)
    db.commit()
    return None

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
