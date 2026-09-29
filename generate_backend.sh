#!/bin/bash
cd backend

cat << 'INNEREOF' > requirements.txt
fastapi==0.103.1
uvicorn==0.23.2
sqlalchemy==2.0.21
pydantic==2.4.2
python-dotenv==1.0.0
pytest==7.4.2
httpx==0.25.0
INNEREOF

cat << 'INNEREOF' > .env.example
APP_ENV=development
DATABASE_URL=sqlite:///./nayakai.db
LLM_API_KEY=
LLM_PROVIDER=
INNEREOF

cat << 'INNEREOF' > README.md
# Nayak AI Backend
Prototype backend for Nayak AI (SIH 2026).
INNEREOF

cat << 'INNEREOF' > app/__init__.py
INNEREOF

cat << 'INNEREOF' > app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, locations, businesses, finance, schemes, advisory
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nayak AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(locations.router, prefix="/api/locations")
app.include_router(businesses.router, prefix="/api/businesses")
app.include_router(finance.router, prefix="/api/finance")
app.include_router(schemes.router, prefix="/api/schemes")
app.include_router(advisory.router, prefix="/api/advisory")
INNEREOF

cat << 'INNEREOF' > app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    APP_ENV = os.getenv("APP_ENV", "development")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nayakai.db")
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "mock")

config = Config()
INNEREOF

cat << 'INNEREOF' > app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import config

engine = create_engine(
    config.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
INNEREOF

cat << 'INNEREOF' > app/models/location.py
from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    village = Column(String, index=True)
    block = Column(String, index=True)
    district = Column(String, index=True)
    state = Column(String, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
INNEREOF

cat << 'INNEREOF' > app/schemas/location.py
from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    village: str
    block: str
    district: str
    state: str

class LocationResponse(LocationBase):
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
INNEREOF

cat << 'INNEREOF' > app/schemas/business.py
from pydantic import BaseModel
from typing import List

class BusinessCategoryResponse(BaseModel):
    id: str
    name: str
    description: str
    typical_starting_cost: int
    market_type: str
    seasonality: str
    risk_level: str
    sample_products: List[str]
INNEREOF

cat << 'INNEREOF' > app/schemas/finance.py
from pydantic import BaseModel, Field
from typing import List

class FinanceCalculateRequest(BaseModel):
    available_margin: float = Field(..., gt=0)
    business_category: str

class RepaymentRequest(BaseModel):
    loan_amount: float = Field(..., gt=0)
    interest_rate: float
    tenure_years: int
    frequency: str

class Installment(BaseModel):
    installment_number: int
    principal: float
    interest: float
    payment: float
    remaining_balance: float

class RepaymentResponse(BaseModel):
    loan_amount: float
    interest_rate: float
    tenure_years: int
    frequency: str
    schedule: List[Installment]

class SchemeRecommendRequest(BaseModel):
    project_cost: float
    available_margin: float

class SchemeRecommendResponse(BaseModel):
    scheme: str
    project_cost: float
    calculated_financing: float
    eligible_loan_limit: float
    recommended_loan: float
    interest_rate: float
    tenure_years: int
    moratorium_months: int
    source: str
INNEREOF

cat << 'INNEREOF' > app/schemas/advisory.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from app.schemas.location import LocationBase
from app.schemas.finance import SchemeRecommendResponse, RepaymentResponse

class AdvisoryRequest(BaseModel):
    location: LocationBase
    available_margin: float = Field(..., gt=0)
    business_category: str

class FinancialPlan(BaseModel):
    available_margin: float
    estimated_project_cost: float
    financing_requirement: float

class AdvisoryResponse(BaseModel):
    request_summary: Dict[str, Any]
    feasibility: Dict[str, Any]
    market_analysis: Dict[str, Any]
    competitor_analysis: Dict[str, Any]
    swot: Dict[str, Any]
    risks: List[str]
    financial_plan: FinancialPlan
    scheme_recommendation: SchemeRecommendResponse
    repayment_plan: RepaymentResponse
    recommendations: List[str]
    disclaimer: str
INNEREOF

cat << 'INNEREOF' > app/routers/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Nayak AI Backend",
        "version": "0.1.0"
    }
INNEREOF

cat << 'INNEREOF' > app/routers/locations.py
from fastapi import APIRouter
from app.schemas.location import LocationResponse

router = APIRouter()

@router.get("/search")
def search_locations(query: str = ""):
    # Prototype sample data
    return {
        "results": [
            {
                "village": "Rampur",
                "block": "Palampur",
                "district": "Kangra",
                "state": "Himachal Pradesh",
                "latitude": 32.11,
                "longitude": 76.53
            }
        ]
    }
INNEREOF

cat << 'INNEREOF' > app/routers/businesses.py
from fastapi import APIRouter
from app.schemas.business import BusinessCategoryResponse
from typing import List

router = APIRouter()

@router.get("/categories")
def get_categories():
    return [
        {
            "id": "dairy",
            "name": "Dairy Farming",
            "description": "Milk production and local distribution.",
            "typical_starting_cost": 500000,
            "market_type": "Local",
            "seasonality": "Year-round",
            "risk_level": "Medium",
            "sample_products": ["Milk", "Curd", "Ghee"]
        }
    ]
INNEREOF

cat << 'INNEREOF' > app/services/financial_service.py
class FinancialService:
    @staticmethod
    def calculate_project_cost(margin: float):
        # Estimated Project Cost = Available Margin / 0.10
        project_cost = margin / 0.10
        financing_requirement = project_cost - margin
        return project_cost, financing_requirement

    @staticmethod
    def calculate_repayment(amount: float, rate: float, years: int, freq: str):
        if freq == "monthly":
            n = years * 12
            r = (rate / 100) / 12
        else:
            n = years * 4
            r = (rate / 100) / 4
        
        # Simple EMI calculation for prototype
        if r > 0:
            payment = amount * r * (1 + r)**n / ((1 + r)**n - 1)
        else:
            payment = amount / n
        
        schedule = []
        balance = amount
        for i in range(1, n + 1):
            interest = balance * r
            principal = payment - interest
            balance -= principal
            if balance < 0:
                balance = 0
            schedule.append({
                "installment_number": i,
                "principal": round(principal, 2),
                "interest": round(interest, 2),
                "payment": round(payment, 2),
                "remaining_balance": round(balance, 2)
            })
        
        return schedule
INNEREOF

cat << 'INNEREOF' > app/services/scheme_router.py
class SchemeRouter:
    @staticmethod
    def recommend(project_cost: float, margin: float):
        financing = project_cost * 0.90
        
        if project_cost <= 140000:
            max_loan = 125000
            recommended_loan = min(financing, max_loan)
            return {
                "scheme": "MICRO FINANCE SCHEME",
                "project_cost": project_cost,
                "calculated_financing": financing,
                "eligible_loan_limit": max_loan,
                "recommended_loan": recommended_loan,
                "interest_rate": 6.5,
                "tenure_years": 3,
                "moratorium_months": 3,
                "source": "NSFDC scheme parameters – prototype implementation"
            }
        else:
            max_loan = 4500000
            recommended_loan = min(financing, max_loan)
            return {
                "scheme": "TERM LOAN SCHEME",
                "project_cost": project_cost,
                "calculated_financing": financing,
                "eligible_loan_limit": max_loan,
                "recommended_loan": recommended_loan,
                "interest_rate": 8.0,
                "tenure_years": 7,
                "moratorium_months": 6,
                "source": "NSFDC scheme parameters – prototype implementation"
            }
INNEREOF

cat << 'INNEREOF' > app/services/ai_service.py
from app.config import config

class AIService:
    @staticmethod
    def generate_advisory(location, category, margin):
        # Mock mode deterministic response
        return {
            "feasibility": {
                "level": "High (Illustrative / Prototype Estimate)",
                "reasons": ["Consistent local demand", "Manageable starting cost"],
                "suggested_next_steps": ["Survey local vendors", "Apply for loan"]
            },
            "market_analysis": {
                "estimated_local_customer_base": "500 households",
                "suggested_service_radius": "5 km",
                "distribution_channels": ["Direct to home", "Local retail shops"]
            },
            "competitor_analysis": {
                "competitor_density": "Low",
                "competitor_types": ["Unorganized vendors"],
                "competitive_observations": ["Scope for quality packaging"]
            },
            "swot": {
                "Strengths": ["Local sourcing"],
                "Weaknesses": ["Initial capital"],
                "Opportunities": ["Government schemes"],
                "Threats": ["Seasonal fluctuations"]
            },
            "risks": ["Supply bottlenecks", "Price fluctuations"]
        }
INNEREOF

cat << 'INNEREOF' > app/routers/finance.py
from fastapi import APIRouter
from app.schemas.finance import FinanceCalculateRequest, RepaymentRequest, RepaymentResponse
from app.services.financial_service import FinancialService

router = APIRouter()

@router.post("/calculate")
def calculate_finance(req: FinanceCalculateRequest):
    pc, fr = FinancialService.calculate_project_cost(req.available_margin)
    return {
        "estimated_project_cost": pc,
        "financing_requirement": fr
    }

@router.post("/repayment", response_model=RepaymentResponse)
def calculate_repayment(req: RepaymentRequest):
    sched = FinancialService.calculate_repayment(req.loan_amount, req.interest_rate, req.tenure_years, req.frequency)
    return {
        "loan_amount": req.loan_amount,
        "interest_rate": req.interest_rate,
        "tenure_years": req.tenure_years,
        "frequency": req.frequency,
        "schedule": sched
    }
INNEREOF

cat << 'INNEREOF' > app/routers/schemes.py
from fastapi import APIRouter
from app.schemas.finance import SchemeRecommendRequest, SchemeRecommendResponse
from app.services.scheme_router import SchemeRouter

router = APIRouter()

@router.post("/recommend", response_model=SchemeRecommendResponse)
def recommend_scheme(req: SchemeRecommendRequest):
    return SchemeRouter.recommend(req.project_cost, req.available_margin)
INNEREOF

cat << 'INNEREOF' > app/routers/advisory.py
from fastapi import APIRouter
from app.schemas.advisory import AdvisoryRequest, AdvisoryResponse
from app.services.financial_service import FinancialService
from app.services.scheme_router import SchemeRouter
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/analyze", response_model=AdvisoryResponse)
def analyze_advisory(req: AdvisoryRequest):
    pc, fr = FinancialService.calculate_project_cost(req.available_margin)
    scheme = SchemeRouter.recommend(pc, req.available_margin)
    freq = "quarterly" if scheme["scheme"] == "MICRO FINANCE SCHEME" else "monthly"
    sched = FinancialService.calculate_repayment(scheme["recommended_loan"], scheme["interest_rate"], scheme["tenure_years"], freq)
    
    ai_insights = AIService.generate_advisory(req.location.dict(), req.business_category, req.available_margin)
    
    return {
        "request_summary": {
            "location": req.location.dict(),
            "business_category": req.business_category,
            "margin": req.available_margin
        },
        "feasibility": ai_insights["feasibility"],
        "market_analysis": ai_insights["market_analysis"],
        "competitor_analysis": ai_insights["competitor_analysis"],
        "swot": ai_insights["swot"],
        "risks": ai_insights["risks"],
        "financial_plan": {
            "available_margin": req.available_margin,
            "estimated_project_cost": pc,
            "financing_requirement": fr
        },
        "scheme_recommendation": scheme,
        "repayment_plan": {
            "loan_amount": scheme["recommended_loan"],
            "interest_rate": scheme["interest_rate"],
            "tenure_years": scheme["tenure_years"],
            "frequency": freq,
            "schedule": sched
        },
        "recommendations": ["Apply for " + scheme["scheme"], "Conduct detailed market survey"],
        "disclaimer": "Prototype estimates only. Actual repayment terms are subject to the applicable channelizing agency / sanction terms."
    }
INNEREOF

cat << 'INNEREOF' > tests/test_endpoints.py
from fastapi.testclient import TestClient
from app.main import app
from app.services.scheme_router import SchemeRouter

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_scheme_mfs():
    # 10,000 margin -> 100,000 project -> 90,000 loan -> <= 140,000
    res = SchemeRouter.recommend(100000, 10000)
    assert res["scheme"] == "MICRO FINANCE SCHEME"
    assert res["recommended_loan"] == 90000

def test_scheme_term():
    # 100,000 margin -> 1,000,000 project -> 900,000 loan -> > 140,000
    res = SchemeRouter.recommend(1000000, 100000)
    assert res["scheme"] == "TERM LOAN SCHEME"
    assert res["recommended_loan"] == 900000

def test_advisory():
    req = {
        "location": {
            "village": "V",
            "block": "B",
            "district": "D",
            "state": "S"
        },
        "available_margin": 100000,
        "business_category": "dairy"
    }
    res = client.post("/api/advisory/analyze", json=req)
    assert res.status_code == 200
    data = res.json()
    assert data["financial_plan"]["estimated_project_cost"] == 1000000
    assert data["financial_plan"]["financing_requirement"] == 900000
    assert data["scheme_recommendation"]["scheme"] == "TERM LOAN SCHEME"
    assert data["scheme_recommendation"]["recommended_loan"] == 900000
INNEREOF

