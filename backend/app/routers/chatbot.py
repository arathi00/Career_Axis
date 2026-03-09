from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.chatbot_log import ChatbotLog
from app.models.user import User
from app.schemas.chatbot import ChatRequest, ChatResponse, ChatHistoryItem, ChatHistoryResponse
from app.services.chatbot_ai import generate_chatbot_response, save_chat_log, get_recent_history

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])


@router.post("/chat", response_model=ChatResponse)
def chat_with_bot(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = (payload.message or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        reply, timestamp = generate_chatbot_response(db, current_user.id, message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    save_chat_log(db, current_user.id, message, reply)
    
    # Return response with proper structure
    return {
        "reply": reply,
        "timestamp": timestamp,
        "is_loading": False,
        "status": None
    }


@router.get("/history", response_model=ChatHistoryResponse)
def get_chat_history(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = get_recent_history(db, user_id=current_user.id, limit=limit)
    items = [
        ChatHistoryItem(
            query=(r.query.split("] ", 1)[1] if r.query and r.query.startswith("[user:") and "] " in r.query else (r.query or "")),
            response=r.response or "",
            timestamp=datetime.utcnow(),
        )
        for r in rows
    ]
    return {"items": items}


@router.delete("/history")
def clear_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prefix = f"[user:{current_user.id}] "
    db.query(ChatbotLog).filter(ChatbotLog.query.like(f"{prefix}%")).delete(synchronize_session=False)
    db.commit()
    return {"message": "Chat history cleared"}


