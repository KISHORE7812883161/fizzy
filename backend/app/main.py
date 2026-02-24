from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from app.core.database import engine, Base, get_db
from app.models.master import (
    Shift as ShiftModel, 
    Unit as UnitModel, 
    Workstation as WorkstationModel,
    Process as ProcessModel,
    Route as RouteModel,
    Product as ProductModel
)
from pydantic import BaseModel, ConfigDict
from typing import Optional, Any

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

class WorkstationBase(BaseModel):
    name: str
    description: Optional[str] = None
    shift_assignments: Optional[List[dict]] = []

class WorkstationCreate(WorkstationBase):
    pass

class Workstation(WorkstationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ProcessBase(BaseModel):
    name: str
    description: Optional[str] = None
    workstation_id: Optional[int] = None
    process_time: float = 0.0
    setup_time: float = 0.0
    technical_values: Optional[List[dict]] = []

class ProcessCreate(ProcessBase):
    pass

class Process(ProcessBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class RouteBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str
    process_sequence: Optional[List[int]] = []

class RouteCreate(RouteBase):
    pass

class Route(RouteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    main_route_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Shift Endpoints
@app.get("/api/shifts", response_model=List[Shift])
def get_shifts(db: Session = Depends(get_db)):
    return db.query(ShiftModel).all()

@app.post("/api/shifts", response_model=Shift)
def create_shift(shift: ShiftCreate, db: Session = Depends(get_db)):
    db_shift = ShiftModel(**shift.dict())
    db.add(db_shift)
    db.commit()
    db.refresh(db_shift)
    return db_shift

@app.put("/api/shifts/{shift_id}", response_model=Shift)
def update_shift(shift_id: int, shift: ShiftCreate, db: Session = Depends(get_db)):
    db_shift = db.query(ShiftModel).filter(ShiftModel.id == shift_id).first()
    if not db_shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    for key, value in shift.dict().items():
        setattr(db_shift, key, value)
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

# Workstation Endpoints
@app.get("/api/workstations", response_model=List[Workstation])
def get_workstations(db: Session = Depends(get_db)):
    return db.query(WorkstationModel).all()

@app.post("/api/workstations", response_model=Workstation)
def create_workstation(ws: WorkstationCreate, db: Session = Depends(get_db)):
    db_ws = WorkstationModel(**ws.dict())
    db.add(db_ws)
    db.commit()
    db.refresh(db_ws)
    return db_ws

@app.put("/api/workstations/{ws_id}", response_model=Workstation)
def update_workstation(ws_id: int, ws: WorkstationCreate, db: Session = Depends(get_db)):
    db_ws = db.query(WorkstationModel).filter(WorkstationModel.id == ws_id).first()
    if not db_ws: raise HTTPException(status_code=404, detail="Workstation not found")
    for key, value in ws.dict().items(): setattr(db_ws, key, value)
    db.commit()
    db.refresh(db_ws)
    return db_ws

@app.delete("/api/workstations/{ws_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workstation(ws_id: int, db: Session = Depends(get_db)):
    db_ws = db.query(WorkstationModel).filter(WorkstationModel.id == ws_id).first()
    if not db_ws: raise HTTPException(status_code=404, detail="Workstation not found")
    db.delete(db_ws)
    db.commit()
    return None

# Process Endpoints
@app.get("/api/processes", response_model=List[Process])
def get_processes(db: Session = Depends(get_db)):
    return db.query(ProcessModel).all()

@app.post("/api/processes", response_model=Process)
def create_process(proc: ProcessCreate, db: Session = Depends(get_db)):
    db_proc = ProcessModel(**proc.dict())
    db.add(db_proc)
    db.commit()
    db.refresh(db_proc)
    return db_proc

@app.put("/api/processes/{proc_id}", response_model=Process)
def update_process(proc_id: int, proc: ProcessCreate, db: Session = Depends(get_db)):
    db_proc = db.query(ProcessModel).filter(ProcessModel.id == proc_id).first()
    if not db_proc: raise HTTPException(status_code=404, detail="Process not found")
    for key, value in proc.dict().items(): setattr(db_proc, key, value)
    db.commit()
    db.refresh(db_proc)
    return db_proc

@app.delete("/api/processes/{proc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_process(proc_id: int, db: Session = Depends(get_db)):
    db_proc = db.query(ProcessModel).filter(ProcessModel.id == proc_id).first()
    if not db_proc: raise HTTPException(status_code=404, detail="Process not found")
    db.delete(db_proc)
    db.commit()
    return None

# Route Endpoints
@app.get("/api/routes", response_model=List[Route])
def get_routes(db: Session = Depends(get_db)):
    return db.query(RouteModel).all()

@app.post("/api/routes", response_model=Route)
def create_route(route: RouteCreate, db: Session = Depends(get_db)):
    db_route = RouteModel(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

@app.put("/api/routes/{route_id}", response_model=Route)
def update_route(route_id: int, route: RouteCreate, db: Session = Depends(get_db)):
    db_route = db.query(RouteModel).filter(RouteModel.id == route_id).first()
    if not db_route: raise HTTPException(status_code=404, detail="Route not found")
    for key, value in route.dict().items(): setattr(db_route, key, value)
    db.commit()
    db.refresh(db_route)
    return db_route

@app.delete("/api/routes/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(route_id: int, db: Session = Depends(get_db)):
    db_route = db.query(RouteModel).filter(RouteModel.id == route_id).first()
    if not db_route: raise HTTPException(status_code=404, detail="Route not found")
    db.delete(db_route)
    db.commit()
    return None

# Product Endpoints
@app.get("/api/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(ProductModel).all()

@app.post("/api/products", response_model=Product)
def create_product(prod: ProductCreate, db: Session = Depends(get_db)):
    db_prod = ProductModel(**prod.dict())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@app.put("/api/products/{prod_id}", response_model=Product)
def update_product(prod_id: int, prod: ProductCreate, db: Session = Depends(get_db)):
    db_prod = db.query(ProductModel).filter(ProductModel.id == prod_id).first()
    if not db_prod: raise HTTPException(status_code=404, detail="Product not found")
    for key, value in prod.dict().items(): setattr(db_prod, key, value)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@app.delete("/api/products/{prod_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(prod_id: int, db: Session = Depends(get_db)):
    db_prod = db.query(ProductModel).filter(ProductModel.id == prod_id).first()
    if not db_prod: raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_prod)
    db.commit()
    return None

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
