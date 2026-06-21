from .emergency_detector import normalize_symptom_text


SYMPTOM_CATEGORY_RULES = {
    "analgesic": ["headache", "fever", "pain", "migraine"],
    "respiratory": ["cough", "cold", "sore throat", "congestion"],
    "rehydration": ["dehydration", "diarrhea", "vomiting", "electrolyte"],
}


def match_symptom_categories(symptom_text):
    normalized_text = normalize_symptom_text(symptom_text)
    matches = []

    for category_slug, keywords in SYMPTOM_CATEGORY_RULES.items():
        matched_keywords = [
            keyword for keyword in keywords if keyword in normalized_text
        ]
        if matched_keywords:
            matches.append(
                {
                    "category_slug": category_slug,
                    "matched_keywords": matched_keywords,
                    "score": len(matched_keywords) * 10,
                }
            )

    return sorted(matches, key=lambda match: match["score"], reverse=True)
