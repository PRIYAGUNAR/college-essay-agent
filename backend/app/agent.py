import os
import json
import logging
from dotenv import load_dotenv
from groq import Groq
from app.prompts import (
    SYSTEM_PROMPT, ESSAY_PROMPT, SCHOOL_PROFILES,
    COMMON_APP_PROMPTS,
    CLICHE_ANALYSIS_PROMPT, VOICE_ANALYSIS_PROMPT,
    SMALL_MOMENT_PROMPT, SO_WHAT_PROMPT,
    VOICE_MATCHED_ESSAY_PROMPT, REVISION_PROMPT,
    CUSTOM_REVISION_PROMPT, SCHOOL_DNA_PROMPT,
    ESSAY_STRENGTH_PROMPT, SENTENCE_REVISION_PROMPT
)

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _parse_json(raw: str) -> dict:
    """Safely parse JSON from AI response."""
    raw = raw.strip()
    # Remove markdown code blocks if present
    if '```' in raw:
        parts = raw.split('```')
        for part in parts:
            part = part.strip()
            if part.startswith('json'):
                part = part[4:].strip()
            try:
                return json.loads(part)
            except Exception:
                continue
    return json.loads(raw)


def _call_groq(messages: list, max_tokens: int = 1024, temperature: float = 0.7) -> str:
    """Make a Groq API call with error handling."""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        raise


def get_reply(messages: list, student_profile: dict) -> str:
    system = SYSTEM_PROMPT
    if student_profile:
        system += "\n\n== STUDENT PROFILE SO FAR ==\n"
        for key, value in student_profile.items():
            system += f"{key}: {value}\n"

    groq_messages = [{"role": "system", "content": system}]
    for m in messages:
        # Sanitize message roles
        role = m.get("role", "user")
        if role not in ["user", "assistant"]:
            role = "user"
        content = m.get("content", "")
        if content:
            groq_messages.append({"role": role, "content": content})

    return _call_groq(groq_messages, max_tokens=1024, temperature=0.85)


def generate_essay(
    profile: dict, story: str, school: str, prompt_id: str = "1"
) -> str:
    school_info = SCHOOL_PROFILES.get(school, "Values authenticity")
    prompt_text = COMMON_APP_PROMPTS.get(prompt_id, COMMON_APP_PROMPTS["1"])
    prompt = ESSAY_PROMPT.format(
        profile=str(profile) if profile else "Student applying to college",
        story=story or "A meaningful personal experience",
        school=f"{school} — {school_info}",
        prompt=f"Prompt {prompt_id}: {prompt_text}"
    )
    return _call_groq([
        {"role": "system", "content": "You are an expert college essay writer. Write only the essay, no preamble."},
        {"role": "user", "content": prompt}
    ], max_tokens=2048, temperature=0.9)


def analyze_cliche(text: str) -> dict:
    if not text or len(text.strip()) < 5:
        return {"has_cliche": False}
    try:
        raw = _call_groq([
            {"role": "system", "content": "Always respond with valid JSON only. No extra text."},
            {"role": "user", "content": CLICHE_ANALYSIS_PROMPT.format(text=text)}
        ], max_tokens=512, temperature=0.3)
        return _parse_json(raw)
    except Exception as e:
        logger.error(f"Cliche analysis error: {e}")
        return {"has_cliche": False, "error": str(e)}


def analyze_voice(messages: list) -> dict:
    if not messages:
        return {"error": "No messages provided"}
    user_messages = [m["content"] for m in messages if m.get("role") == "user"][-5:]
    if not user_messages:
        return {"error": "No user messages found"}
    combined = "\n".join(user_messages)
    try:
        raw = _call_groq([
            {"role": "system", "content": "Always respond with valid JSON only."},
            {"role": "user", "content": VOICE_ANALYSIS_PROMPT.format(messages=combined)}
        ], max_tokens=512, temperature=0.3)
        return _parse_json(raw)
    except Exception as e:
        logger.error(f"Voice analysis error: {e}")
        return {"error": str(e)}


def analyze_small_moment(text: str) -> dict:
    if not text or len(text.strip()) < 10:
        return {"has_story": False}
    try:
        raw = _call_groq([
            {"role": "system", "content": "Always respond with valid JSON only."},
            {"role": "user", "content": SMALL_MOMENT_PROMPT.format(text=text)}
        ], max_tokens=512, temperature=0.4)
        return _parse_json(raw)
    except Exception as e:
        logger.error(f"Moment analysis error: {e}")
        return {"has_story": False, "error": str(e)}


def analyze_so_what(text: str) -> dict:
    if not text or len(text.strip()) < 10:
        return {"depth_reached": "1"}
    try:
        raw = _call_groq([
            {"role": "system", "content": "Always respond with valid JSON only."},
            {"role": "user", "content": SO_WHAT_PROMPT.format(text=text)}
        ], max_tokens=512, temperature=0.4)
        return _parse_json(raw)
    except Exception as e:
        logger.error(f"So what analysis error: {e}")
        return {"depth_reached": "1", "error": str(e)}


def generate_voice_matched_essay(
    profile: dict, story: str, school: str,
    voice_profile: dict, prompt_id: str = "1"
) -> str:
    school_info = SCHOOL_PROFILES.get(school, "Values authenticity")
    prompt_text = COMMON_APP_PROMPTS.get(prompt_id, COMMON_APP_PROMPTS["1"])
    prompt = VOICE_MATCHED_ESSAY_PROMPT.format(
        profile=str(profile) if profile else "Student applying to college",
        story=story or "A meaningful personal experience",
        school=f"{school} — {school_info}",
        prompt=f"Prompt {prompt_id}: {prompt_text}",
        vocabulary=voice_profile.get("vocabulary", "medium"),
        tone=voice_profile.get("tone", "mixed"),
        humor=voice_profile.get("humor", "none"),
        sentence_length=voice_profile.get("sentence_length", "medium"),
        unique_phrases=", ".join(voice_profile.get("unique_phrases", [])),
        writing_summary=voice_profile.get("writing_summary", "Natural student voice")
    )
    return _call_groq([
        {"role": "system", "content": "Write only the essay, no commentary or preamble."},
        {"role": "user", "content": prompt}
    ], max_tokens=2048, temperature=0.9)


def revise_essay(essay: str, revision_type: str) -> str:
    if not essay:
        raise ValueError("Essay cannot be empty")
    return _call_groq([
        {"role": "system", "content": "Return only the revised essay, no commentary."},
        {"role": "user", "content": REVISION_PROMPT.format(essay=essay, revision_type=revision_type)}
    ], max_tokens=2048, temperature=0.85)


def custom_revise_essay(essay: str, instruction: str) -> str:
    if not essay or not instruction:
        raise ValueError("Essay and instruction cannot be empty")
    return _call_groq([
        {"role": "system", "content": "Return only the revised essay, no commentary."},
        {"role": "user", "content": CUSTOM_REVISION_PROMPT.format(essay=essay, instruction=instruction)}
    ], max_tokens=2048, temperature=0.85)


def revise_sentence(essay: str, selected_text: str, instruction: str) -> str:
    if not essay or not selected_text or not instruction:
        raise ValueError("Essay, selected text, and instruction cannot be empty")
    return _call_groq([
        {"role": "system", "content": "Return only the rewritten text, no commentary."},
        {"role": "user", "content": SENTENCE_REVISION_PROMPT.format(
            essay=essay, selected_text=selected_text, instruction=instruction
        )}
    ], max_tokens=512, temperature=0.85)


def analyze_school_dna(story: str, school: str) -> dict:
    school_values = SCHOOL_PROFILES.get(school, "Values authenticity")
    try:
        raw = _call_groq([
            {"role": "system", "content": "Always respond with valid JSON only."},
            {"role": "user", "content": SCHOOL_DNA_PROMPT.format(
                story=story, school=school, school_values=school_values
            )}
        ], max_tokens=768, temperature=0.4)
        return _parse_json(raw)
    except Exception as e:
        logger.error(f"School DNA error: {e}")
        return {"fit_score": 5, "error": str(e)}


def analyze_essay_strength(essay: str) -> dict:
    if not essay or len(essay.strip()) < 50:
        return {"overall_score": 0, "error": "Essay too short to analyze"}
    try:
        raw = _call_groq([
            {"role": "system", "content": "Always respond with valid JSON only."},
            {"role": "user", "content": ESSAY_STRENGTH_PROMPT.format(essay=essay)}
        ], max_tokens=768, temperature=0.3)
        return _parse_json(raw)
    except Exception as e:
        logger.error(f"Strength analysis error: {e}")
        return {"overall_score": 5, "error": str(e)}