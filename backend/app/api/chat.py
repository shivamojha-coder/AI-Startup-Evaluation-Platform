import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Any, Optional, cast, Literal
from groq import Groq
from groq.types.chat import ChatCompletionMessageParam

from app.api.deps import require_role
from app.core.supabase_client import supabase_service_client
from app.core.config import settings
from app.agents.base import load_prompt

logger = logging.getLogger(__name__)
router = APIRouter()
groq_client = Groq(api_key=settings.GROQ_API_KEY)


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None  # If None, a new session will be created


class ChatResponse(BaseModel):
    answer: str
    session_id: str


class UpdateSessionRequest(BaseModel):
    is_pinned: Optional[bool] = None
    title: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# Helper: Fetch startup context for AI prompt
# ─────────────────────────────────────────────────────────────────────────────

def _get_startup_context(startup_id: str) -> str:
    context_parts = []
    try:
        # 1. Fetch Startup basic details
        startup_resp = (
            supabase_service_client.table("startups")
            .select("*")
            .eq("id", startup_id)
            .execute()
        )
        if startup_resp.data:
            s_data = startup_resp.data[0]
            if isinstance(s_data, dict):
                context_parts.append(
                    f"### STARTUP BASIC INFO\n"
                    f"Startup Name: {s_data.get('startup_name', '')}\n"
                    f"Tagline: {s_data.get('tagline', '')}\n"
                    f"Industry: {s_data.get('industry', '')}\n"
                    f"Stage: {s_data.get('stage', '')}\n"
                    f"Description: {s_data.get('description', '')}\n"
                    f"Funding Raised: {s_data.get('funding_raised', '')}\n"
                    f"Team Size: {s_data.get('team_size', '')}\n"
                )

        # 2. Fetch latest completed evaluation metadata
        eval_resp = (
            supabase_service_client.table("evaluations")
            .select("id")
            .eq("startup_id", startup_id)
            .eq("status", "completed")
            .order("version", desc=True)
            .limit(1)
            .execute()
        )
        if eval_resp.data:
            row = eval_resp.data[0]
            if isinstance(row, dict):
                eval_id = row["id"]
                
                # 3. Fetch Complete Executive Summary
                summary_resp = (
                    supabase_service_client.table("executive_summaries")
                    .select("*")
                    .eq("evaluation_id", eval_id)
                    .execute()
                )
                if summary_resp.data:
                    s = summary_resp.data[0]
                    if isinstance(s, dict):
                        context_parts.append(
                            f"### EXECUTIVE SUMMARY & PITCH DETAILS\n"
                            f"Problem: {s.get('problem', '')}\n"
                            f"Solution: {s.get('solution', '')}\n"
                            f"Target Market: {s.get('target_market', '')}\n"
                            f"Business Model: {s.get('business_model', '')}\n"
                            f"Traction: {s.get('traction', '')}\n"
                            f"Executive Summary Text: {s.get('executive_summary', '')}\n"
                        )

                # 4. Fetch Scores and Score Reasoning
                scores_resp = (
                    supabase_service_client.table("scores")
                    .select("*")
                    .eq("evaluation_id", eval_id)
                    .execute()
                )
                if scores_resp.data:
                    sc = scores_resp.data[0]
                    if isinstance(sc, dict):
                        context_parts.append(
                            f"### EVALUATION SCORES\n"
                            f"Overall Startup Score: {sc.get('startup_score', 0)}/100\n"
                            f"Market Opportunity Score: {sc.get('market_opportunity', 0)}/100\n"
                            f"Product Innovation Score: {sc.get('product_innovation', 0)}/100\n"
                            f"Team Strength Score: {sc.get('team_strength', 0)}/100\n"
                            f"Business Model Score: {sc.get('business_model_score', 0)}/100\n"
                            f"Competitive Advantage Score: {sc.get('competitive_advantage', 0)}/100\n"
                            f"Traction Score: {sc.get('traction_score', 0)}/100\n"
                            f"Scalability Score: {sc.get('scalability', 0)}/100\n"
                            f"Score Reasoning: {sc.get('score_reasoning', '')}\n"
                        )

                # 5. Fetch Identified Risks
                risks_resp = (
                    supabase_service_client.table("identified_risks")
                    .select("*")
                    .eq("evaluation_id", eval_id)
                    .execute()
                )
                if risks_resp.data:
                    risks_list = []
                    for r in risks_resp.data:
                        if isinstance(r, dict):
                            severity_val = str(r.get("severity") or "medium")
                            risks_list.append(f"- [{severity_val.upper()}] {r.get('category', '')}: {r.get('risk', '')}")
                    if risks_list:
                        context_parts.append("### IDENTIFIED RISKS & SEVERITY\n" + "\n".join(risks_list) + "\n")

                # 6. Fetch Investor Questions
                questions_resp = (
                    supabase_service_client.table("investor_questions")
                    .select("*")
                    .eq("evaluation_id", eval_id)
                    .execute()
                )
                if questions_resp.data:
                    q_list = []
                    for q in questions_resp.data:
                        if isinstance(q, dict):
                            q_list.append(f"- ({q.get('category', '')}) {q.get('question', '')}")
                    if q_list:
                        context_parts.append("### SUGGESTED INVESTOR DUE DILIGENCE QUESTIONS\n" + "\n".join(q_list) + "\n")
    except Exception as e:
        logger.error(f"Error fetching startup context: {e}")
        
    return "\n".join(context_parts) if context_parts else "No context available."


# ─────────────────────────────────────────────────────────────────────────────
# GET /chat/sessions — list all sessions for current user
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/sessions", summary="Get all chat sessions for the current user")
def get_chat_sessions(current_user: dict = Depends(require_role("investor"))):
    user_id = current_user["id"]
    resp = (
        supabase_service_client.table("chat_sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("is_pinned", desc=True)
        .order("updated_at", desc=True)
        .execute()
    )
    return resp.data or []


# ─────────────────────────────────────────────────────────────────────────────
# PATCH /chat/sessions/{session_id} — update title or pin status
# ─────────────────────────────────────────────────────────────────────────────

@router.patch("/sessions/{session_id}", summary="Update a chat session (pin/rename)")
def update_chat_session(
    session_id: str,
    body: UpdateSessionRequest,
    current_user: dict = Depends(require_role("investor")),
):
    user_id = current_user["id"]
    update_data: dict[str, bool | str] = {}
    if body.is_pinned is not None:
        update_data["is_pinned"] = body.is_pinned
    if body.title is not None:
        update_data["title"] = body.title

    if not update_data:
        raise HTTPException(status_code=400, detail="Nothing to update")

    resp = (
        supabase_service_client.table("chat_sessions")
        .update(update_data)
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Session not found")
    return resp.data[0]


# ─────────────────────────────────────────────────────────────────────────────
# DELETE /chat/sessions/{session_id} — delete a session and all its messages
# ─────────────────────────────────────────────────────────────────────────────

@router.delete("/sessions/{session_id}", summary="Delete a chat session")
def delete_chat_session(
    session_id: str,
    current_user: dict = Depends(require_role("investor")),
):
    user_id = current_user["id"]
    resp = (
        supabase_service_client.table("chat_sessions")
        .delete()
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    return {"deleted": True}


# ─────────────────────────────────────────────────────────────────────────────
# GET /chat/sessions/{session_id}/messages — get all messages for a session
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/messages", summary="Get messages for a session")
def get_session_messages(
    session_id: str,
    current_user: dict = Depends(require_role("investor")),
):
    user_id = current_user["id"]

    # Verify ownership
    session_resp = (
        supabase_service_client.table("chat_sessions")
        .select("id")
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not session_resp.data:
        raise HTTPException(status_code=404, detail="Session not found")

    msgs_resp = (
        supabase_service_client.table("chat_messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .execute()
    )
    return msgs_resp.data or []


# ─────────────────────────────────────────────────────────────────────────────
# POST /startups/{startup_id}/chat — main AI chat endpoint (saves to DB)
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/startups/{startup_id}/chat",
    response_model=ChatResponse,
    summary="Ask an AI question about a specific startup",
)
def startup_ai_chat(
    startup_id: str,
    request: ChatRequest,
    current_user: dict = Depends(require_role("investor")),
):
    user_id = current_user["id"]

    try:
        # ── 1. Resolve or create session ──────────────────────────────────────
        session_id = request.session_id

        if not session_id:
            # Auto-generate title from the first few words of the question
            words = request.question.strip().split()
            title = " ".join(words[:6]) + ("..." if len(words) > 6 else "")

            sess_resp = supabase_service_client.table("chat_sessions").insert({
                "user_id": user_id,
                "startup_id": startup_id,
                "title": title,
            }).execute()

            if not sess_resp.data:
                raise HTTPException(status_code=500, detail="Failed to create chat session")
            session_id = cast(dict, sess_resp.data[0])["id"]
        else:
            # Update session timestamp & attach startup_id if missing
            supabase_service_client.table("chat_sessions").update({
                "startup_id": startup_id,
                "updated_at": "now()",
            }).eq("id", session_id).eq("user_id", user_id).execute()

        # Load conversation history for memory before inserting the new user message
        history_messages: list[ChatCompletionMessageParam] = []
        if request.session_id:
            history_resp = (
                supabase_service_client.table("chat_messages")
                .select("role", "content")
                .eq("session_id", session_id)
                .order("created_at", desc=False)
                .execute()
            )
            if history_resp.data:
                for msg in history_resp.data:
                    if isinstance(msg, dict):
                        role_val = msg.get("role")
                        content_val = msg.get("content")
                        if isinstance(role_val, str) and isinstance(content_val, str):
                            role: Literal["assistant", "user"] = (
                                "assistant" if role_val == "ai" else "user"
                            )
                            history_messages.append(
                                cast(ChatCompletionMessageParam, {"role": role, "content": content_val})
                            )

        # ── 2. Save user message ─────────────────────────────────────────────
        supabase_service_client.table("chat_messages").insert({
            "session_id": session_id,
            "role": "user",
            "content": request.question,
        }).execute()

        # ── 3. Build AI context & call Groq ──────────────────────────────────
        context_text = _get_startup_context(startup_id)

        if not groq_client:
            raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY")

        # Load detailed system prompt template
        system_prompt = load_prompt("chatbot_prompt.md")
        system_content = f"{system_prompt}\n\n## STARTUP CONTEXT\n{context_text}"

        # Combine system prompt with history and the latest user message
        messages: list[ChatCompletionMessageParam] = [{"role": "system", "content": system_content}]
        messages.extend(history_messages)
        messages.append({"role": "user", "content": request.question})

        chat_res = groq_client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192",
        )

        answer = chat_res.choices[0].message.content or "I'm sorry, I couldn't generate an answer."

        # ── 4. Save AI message ───────────────────────────────────────────────
        supabase_service_client.table("chat_messages").insert({
            "session_id": session_id,
            "role": "ai",
            "content": answer,
        }).execute()

        return {"answer": answer, "session_id": session_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in AI chat: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e
