"""
Explainability helpers (SHAP/LIME scaffolding).
If SHAP/LIME are not installed or no model is provided, returns placeholders.
"""
from typing import List, Dict, Optional, Callable


def _placeholder_explanations(reasoning: List[Dict]) -> Dict[str, List[Dict]]:
    shap_values = []
    lime_explanations = []

    for item in reasoning:
        factor = item.get("factor", "Unknown")
        weight = float(item.get("weight", 0.0) or 0.0)
        impact = item.get("impact", "neutral")
        sign = 1.0 if impact == "positive" else -1.0 if impact == "negative" else 0.0

        shap_values.append({
            "feature": factor,
            "value": round(weight * sign, 4),
        })

        lime_explanations.append({
            "feature": factor,
            "contribution": round(weight * sign, 4),
        })

    return {
        "shap": shap_values,
        "lime": lime_explanations,
        "status": "placeholder",
    }


def generate_explanations(
    reasoning: List[Dict],
    model_fn: Optional[Callable] = None,
    feature_vector: Optional[List[float]] = None,
    feature_names: Optional[List[str]] = None,
) -> Dict[str, List[Dict]]:
    """
    Generate SHAP/LIME explanations.
    If SHAP/LIME libraries are missing or no model_fn is provided,
    falls back to placeholders derived from reasoning weights.
    """
    try:
        import shap  # noqa: F401
        import lime  # noqa: F401
    except Exception:
        return _placeholder_explanations(reasoning)

    if model_fn is None or feature_vector is None or feature_names is None:
        return _placeholder_explanations(reasoning)

    # Placeholder: integrate real SHAP/LIME with your trained model later.
    # Keeping placeholder output to avoid misleading results without a model.
    return _placeholder_explanations(reasoning)