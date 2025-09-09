// Normalizes technology proficiency data coming from SQL into a consistent numeric+label form
// Input items may have level as a string label (e.g., "Advanced"), a number, or a percent string.
// Output adds: level_percent (0-100), level_label (Beginner/Intermediate/Advanced/Master),
//              level_min, level_max to indicate the label range boundaries.

function coerceToPercent(rawLevel) {
  if (rawLevel === null || rawLevel === undefined) return undefined;

  // Number already
  if (typeof rawLevel === 'number' && isFinite(rawLevel)) return clamp(rawLevel);

  // Percent string like "85%"
  if (typeof rawLevel === 'string') {
    const percentMatch = rawLevel.match(/(\d{1,3})%/);
    if (percentMatch) {
      const val = parseInt(percentMatch[1], 10);
      if (!isNaN(val)) return clamp(val);
    }

    // Numeric string
    const num = Number(rawLevel);
    if (!isNaN(num)) return clamp(num);

    // Qualitative label mapping
    switch (rawLevel.toLowerCase()) {
      case 'master':
      case 'expert':
        return 95;
      case 'advanced':
        return 85;
      case 'intermediate':
        return 70;
      case 'beginner':
        return 30;
      default:
        return undefined;
    }
  }

  return undefined;
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function labelForPercent(p) {
  if (p >= 90) return { label: 'Master', min: 90, max: 100 };
  if (p >= 61) return { label: 'Advanced', min: 61, max: 89 };
  if (p >= 31) return { label: 'Intermediate', min: 31, max: 60 };
  return { label: 'Beginner', min: 0, max: 30 };
}

function normalizeTechnology(t) {
  const percent = coerceToPercent(t.level);
  const { label, min, max } = percent !== undefined ? labelForPercent(percent) : { label: t.level || '', min: undefined, max: undefined };

  return {
    ...t,
    // preserve original level value
    level: t.level,
    // enriched fields for frontend
    level_percent: percent !== undefined ? percent : undefined,
    level_label: label,
    level_min: min,
    level_max: max,
  };
}

function normalizeTechnologies(techArray) {
  if (!Array.isArray(techArray)) return [];
  return techArray.map(normalizeTechnology);
}

module.exports = {
  normalizeTechnologies,
};
