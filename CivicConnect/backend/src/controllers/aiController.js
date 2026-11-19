import { store } from '../config/supabase.js';

/**
 * Modular AI Image Classification Interface
 * Section 20 of Master Specification:
 * Communicates with optional Python microservice or returns calibrated demonstration confidence
 */
export async function classifyCivicImage(req, res) {
  try {
    const { imageUrl, fileName } = req.body;

    const pythonServiceUrl = process.env.AI_SERVICE_URL;

    // 1. If external Python microservice is active
    if (pythonServiceUrl) {
      try {
        const response = await fetch(`${pythonServiceUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, fileName })
        });
        if (response.ok) {
          const result = await response.json();
          return res.json(result);
        }
      } catch (err) {
        console.warn('AI microservice unreachable, falling back to heuristic assistant.');
      }
    }

    // 2. Demonstration AI classification based on filename / sample heuristics
    // Clearly marked as [DEMONSTRATION ASSISTANT]
    const lowerName = (fileName || imageUrl || '').toLowerCase();

    let suggestedSlug = 'potholes';
    let confidence = 0.88;

    if (lowerName.includes('garbage') || lowerName.includes('trash') || lowerName.includes('waste')) {
      suggestedSlug = 'garbage';
      confidence = 0.92;
    } else if (lowerName.includes('water') || lowerName.includes('leak') || lowerName.includes('pipe')) {
      suggestedSlug = 'water-leakage';
      confidence = 0.86;
    } else if (lowerName.includes('flood') || lowerName.includes('logging')) {
      suggestedSlug = 'waterlogging';
      confidence = 0.91;
    } else if (lowerName.includes('light') || lowerName.includes('lamp') || lowerName.includes('dark')) {
      suggestedSlug = 'streetlight';
      confidence = 0.89;
    } else if (lowerName.includes('signal') || lowerName.includes('traffic')) {
      suggestedSlug = 'traffic-signals';
      confidence = 0.87;
    }

    const matchedCategory = store.categories.find(c => c.slug === suggestedSlug) || store.categories[0];

    res.json({
      isAiServiceActive: Boolean(pythonServiceUrl),
      isDemonstrationMode: true,
      suggestedCategory: {
        id: matchedCategory.id,
        name: matchedCategory.name,
        slug: matchedCategory.slug,
        defaultSeverity: matchedCategory.defaultSeverity
      },
      confidenceScore: confidence,
      disclaimer: 'Academic Demonstration AI Assistant. Citizens can freely override this suggested category.'
    });
  } catch (error) {
    console.error('Error in classifyCivicImage:', error);
    res.status(500).json({ error: 'AI classification failed.' });
  }
}
