import re


EMERGENCY_KEYWORDS = [
    "chest pain",
    "difficulty breathing",
    "shortness of breath",
    "severe allergic reaction",
    "swelling of face",
    "swelling of tongue",
    "seizure",
    "stroke",
    "severe bleeding",
    "unconscious",
    "overdose",
    "poisoning",
]


def normalize_symptom_text(text):
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def detect_emergency(symptom_text):
    normalized_text = normalize_symptom_text(symptom_text)
    matched_keywords = [
        keyword for keyword in EMERGENCY_KEYWORDS if keyword in normalized_text
    ]

    return {
        "has_emergency": bool(matched_keywords),
        "matched_keywords": matched_keywords,
        "reason": ", ".join(matched_keywords),
    }
