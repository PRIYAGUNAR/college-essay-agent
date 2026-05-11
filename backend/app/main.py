from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from app.agent import (
    get_reply, generate_essay,
    analyze_cliche, analyze_voice,
    analyze_small_moment, analyze_so_what,
    generate_voice_matched_essay,
    revise_essay, custom_revise_essay, revise_sentence,
    analyze_school_dna, analyze_essay_strength
)
from app.prompts import COMMON_APP_PROMPTS
import logging

logger = logging.getLogger(__name__)
app = FastAPI(title="College Essay Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    messages: list
    student_profile: dict = {}

    @validator('messages')
    def messages_not_empty(cls, v):
        if not v:
            raise ValueError('Messages cannot be empty')
        return v


class EssayRequest(BaseModel):
    profile: dict = {}
    story: str
    school: str = "Stanford"
    prompt_id: str = "1"


class ClicheRequest(BaseModel):
    text: str


class VoiceRequest(BaseModel):
    messages: list


class MomentRequest(BaseModel):
    text: str


class VoiceEssayRequest(BaseModel):
    profile: dict = {}
    story: str
    school: str = "Stanford"
    voice_profile: dict = {}
    prompt_id: str = "1"


class RevisionRequest(BaseModel):
    essay: str
    revision_type: str


class CustomRevisionRequest(BaseModel):
    essay: str
    instruction: str


class SentenceRevisionRequest(BaseModel):
    essay: str
    selected_text: str
    instruction: str


class SchoolDNARequest(BaseModel):
    story: str
    school: str


class EssayStrengthRequest(BaseModel):
    essay: str


@app.get("/")
def root():
    return {"status": "College Essay Agent is running", "version": "1.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/prompts")
def get_prompts():
    return {"prompts": COMMON_APP_PROMPTS}


@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        reply = get_reply(req.messages, req.student_profile)
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-essay")
async def essay(req: EssayRequest):
    try:
        result = generate_essay(
            req.profile, req.story, req.school, req.prompt_id
        )
        return {"essay": result}
    except Exception as e:
        logger.error(f"Essay generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-cliche")
async def cliche(req: ClicheRequest):
    try:
        return analyze_cliche(req.text)
    except Exception as e:
        return {"has_cliche": False, "error": str(e)}


@app.post("/analyze-voice")
async def voice(req: VoiceRequest):
    try:
        return analyze_voice(req.messages)
    except Exception as e:
        return {"error": str(e)}


@app.post("/analyze-moment")
async def moment(req: MomentRequest):
    try:
        return analyze_small_moment(req.text)
    except Exception as e:
        return {"has_story": False, "error": str(e)}


@app.post("/analyze-so-what")
async def so_what(req: MomentRequest):
    try:
        return analyze_so_what(req.text)
    except Exception as e:
        return {"depth_reached": "1", "error": str(e)}


@app.post("/generate-voice-essay")
async def voice_essay(req: VoiceEssayRequest):
    try:
        result = generate_voice_matched_essay(
            req.profile, req.story, req.school,
            req.voice_profile, req.prompt_id
        )
        return {"essay": result}
    except Exception as e:
        logger.error(f"Voice essay error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/revise-essay")
async def revise(req: RevisionRequest):
    try:
        result = revise_essay(req.essay, req.revision_type)
        return {"essay": result}
    except Exception as e:
        logger.error(f"Revision error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/custom-revise-essay")
async def custom_revise(req: CustomRevisionRequest):
    try:
        result = custom_revise_essay(req.essay, req.instruction)
        return {"essay": result}
    except Exception as e:
        logger.error(f"Custom revision error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/revise-sentence")
async def sentence_revise(req: SentenceRevisionRequest):
    try:
        result = revise_sentence(
            req.essay, req.selected_text, req.instruction
        )
        return {"revised_text": result}
    except Exception as e:
        logger.error(f"Sentence revision error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-school-dna")
async def school_dna(req: SchoolDNARequest):
    try:
        return analyze_school_dna(req.story, req.school)
    except Exception as e:
        return {"fit_score": 5, "error": str(e)}


@app.post("/analyze-essay-strength")
async def essay_strength(req: EssayStrengthRequest):
    try:
        return analyze_essay_strength(req.essay)
    except Exception as e:
        return {"overall_score": 5, "error": str(e)}