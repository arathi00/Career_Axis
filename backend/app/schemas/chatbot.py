from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
	message: str = Field(..., min_length=1, max_length=4000)


class ChatResponse(BaseModel):
	reply: str = Field(..., description="AI response message")
	timestamp: datetime = Field(..., description="When response was generated")
	is_loading: bool = Field(False, description="Indicates if response is still processing")
	status: Optional[str] = Field(None, description="Current status: 'analyzing', 'generating', or None")


class ChatHistoryItem(BaseModel):
	query: str
	response: str
	timestamp: datetime


class ChatHistoryResponse(BaseModel):
	items: list[ChatHistoryItem]

