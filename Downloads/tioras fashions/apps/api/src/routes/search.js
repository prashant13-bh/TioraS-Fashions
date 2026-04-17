import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /search
router.post('/', async (req, res) => {
  const { query, limit = 10 } = req.body;

  // Input validation
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'query parameter is required and must be a non-empty string' });
  }

  const searchQuery = query.trim().toLowerCase();

  // Build filter for partial matching across multiple fields
  const filter = `name ~ "${searchQuery}" || description ~ "${searchQuery}" || category ~ "${searchQuery}"`;

  // Fetch products from PocketBase
  const options = {
    filter,
    sort: '-created',
  };

  if (limit && limit !== 'all') {
    options.limit = Math.min(parseInt(limit), 100); // Cap at 100 to prevent abuse
  }

  const products = await pb.collection('products').getFullList(options);

  // Map products to response format
  const results = products.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.image || null,
    price: product.price,
    category: product.category,
  }));

  logger.info(`Search performed for query: "${searchQuery}", found ${results.length} results`);

  res.json({
    results,
    count: results.length,
  });
});

export default router;