from pydantic import BaseModel
from typing import Optional

class CompanyInfo(BaseModel):
    companyName: str
    ceo: str
    country: str

    sector: str
    revenue: Optional[float] = None
    employees: int
    year: Optional[int] = None

    ticker: Optional[str] = None
    links: Optional[str] = None

    funding_range: Optional[str] = None

    isPublic: Optional[bool] = False
    isStartup: Optional[bool] = False

