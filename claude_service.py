"""
Claude AI service — wraps Anthropic SDK calls with retry logic and JSON parsing.
"""
import os
import json
import re
import asyncio
from typing import Any

import anthropic
from dotenv import load_dotenv

load_dotenv()

# Instantiate the Anthropic client (reads ANTHROPIC_API_KEY from env)
_client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

MODEL = "claude-3-5-haiku-20241022"   # Fast & cost-efficient; swap for claude-3-5-sonnet for higher quality
MAX_TOKENS = 1500
MAX_RETRIES = 2


async def ask_claude(system: str, user: str, max_tokens: int = MAX_TOKENS) -> str:
    """
    Send a prompt to Claude and return the raw text response.
    Retries up to MAX_RETRIES times on transient errors.
    """
    for attempt in range(MAX_RETRIES + 1):
        try:
            msg = await _client.messages.create(
                model=MODEL,
                max_tokens=max_tokens,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            return msg.content[0].text
        except anthropic.RateLimitError:
            if attempt < MAX_RETRIES:
                await asyncio.sleep(2 ** attempt)
            else:
                raise
        except anthropic.APIConnectionError:
            if attempt < MAX_RETRIES:
                await asyncio.sleep(1)
            else:
                raise


def parse_json(raw: str) -> Any:
    """
    Strips markdown fences and parses JSON from Claude's response.
    Raises ValueError if parsing fails.
    """
    # Remove ```json ... ``` or ``` ... ``` fences
    clean = re.sub(r"```(?:json)?\s*", "", raw).strip()
    clean = clean.rstrip("`").strip()

    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        # Try to find JSON in the string as fallback
        match = re.search(r"[\[{].*[\]}]", clean, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Could not parse JSON from response: {e}\nRaw: {raw[:300]}")


async def ask_claude_json(system: str, user: str, max_tokens: int = MAX_TOKENS) -> Any:
    """Ask Claude and return parsed JSON."""
    raw = await ask_claude(system, user, max_tokens)
    return parse_json(raw)
