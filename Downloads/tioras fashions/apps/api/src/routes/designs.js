import { Router } from 'express';
import PDFDocument from 'pdfkit';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /designs/calculate-price
router.post('/calculate-price', async (req, res) => {
	const { productType, customizationType, designComplexity, quantity, rushDelivery } = req.body;

	// Input validation
	if (!productType || !customizationType || designComplexity === undefined || !quantity) {
		return res.status(400).json({
			error: 'Missing required fields: productType, customizationType, designComplexity, quantity',
		});
	}

	if (typeof designComplexity !== 'number' || designComplexity < 1) {
		return res.status(400).json({ error: 'designComplexity must be a positive number' });
	}

	if (typeof quantity !== 'number' || quantity < 1) {
		return res.status(400).json({ error: 'quantity must be a positive number' });
	}

	// Fetch pricing rules from PocketBase
	const pricingRules = await pb.collection('pricingRules').getFullList({
		filter: `productType = "${productType}" && customizationType = "${customizationType}"`,
	});

	if (pricingRules.length === 0) {
		throw new Error(`No pricing rules found for productType: ${productType}, customizationType: ${customizationType}`);
	}

	const rule = pricingRules[0];
	const basePrice = rule.basePrice || 0;
	const customizationCost = rule.customizationCost || 0;
	const colorMultiplier = rule.colorMultiplier || 5;
	const rushFee = rule.rushFee || 50;

	// Calculate complexity cost
	const complexityCost = designComplexity * colorMultiplier;

	// Calculate rush delivery fee
	const rushDeliveryFee = rushDelivery ? rushFee : 0;

	// Calculate subtotal before bulk discount
	const subtotalPerUnit = basePrice + customizationCost + complexityCost + (rushDeliveryFee / quantity);
	const subtotal = subtotalPerUnit * quantity;

	// Apply bulk discounts
	let bulkDiscount = 0;
	if (quantity >= 100) {
		bulkDiscount = subtotal * 0.15; // 15% discount
	} else if (quantity >= 50) {
		bulkDiscount = subtotal * 0.10; // 10% discount
	} else if (quantity >= 10) {
		bulkDiscount = subtotal * 0.05; // 5% discount
	}

	// Calculate final total
	const totalPrice = subtotal - bulkDiscount;
	const pricePerUnit = totalPrice / quantity;

	logger.info(`Price calculated for ${productType} - ${customizationType}: ${totalPrice}`);

	res.json({
		basePrice,
		customizationCost,
		complexityCost,
		bulkDiscount: Math.round(bulkDiscount * 100) / 100,
		rushDeliveryFee,
		totalPrice: Math.round(totalPrice * 100) / 100,
		pricePerUnit: Math.round(pricePerUnit * 100) / 100,
	});
});

// POST /designs/export-pdf
router.post('/export-pdf', async (req, res) => {
	const { designId } = req.body;

	// Input validation
	if (!designId) {
		return res.status(400).json({ error: 'designId is required' });
	}

	// Fetch design from PocketBase
	const design = await pb.collection('customDesigns').getOne(designId);

	if (!design) {
		throw new Error(`Design not found with ID: ${designId}`);
	}

	// Extract design data
	const {
		designData,
		productType,
		productColor,
		size,
		price,
		customizationDetails,
		placementInfo,
		colorsUsed,
		textContent,
		embroiderySettings,
		printSettings,
		priceBreakdown,
	} = design;

	// Create PDF document
	const doc = new PDFDocument({
		size: 'A4',
		margin: 40,
	});

	// Set response headers
	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `attachment; filename="design-${designId}.pdf"`);

	// Pipe PDF to response
	doc.pipe(res);

	// Add title
	doc.fontSize(24).font('Helvetica-Bold').text('TioraS Fashions Studio', { align: 'center' });
	doc.fontSize(14).font('Helvetica').text('Custom Design Export', { align: 'center' });
	doc.moveDown();

	// Add design ID and date
	doc.fontSize(10).text(`Design ID: ${designId}`, { align: 'left' });
	doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'left' });
	doc.moveDown();

	// Add product details section
	doc.fontSize(12).font('Helvetica-Bold').text('Product Details', { underline: true });
	doc.fontSize(10).font('Helvetica');
	doc.text(`Product Type: ${productType || 'N/A'}`);
	doc.text(`Color: ${productColor || 'N/A'}`);
	doc.text(`Size: ${size || 'N/A'}`);
	doc.moveDown();

	// Add customization details
	if (customizationDetails) {
		doc.fontSize(12).font('Helvetica-Bold').text('Customization Details', { underline: true });
		doc.fontSize(10).font('Helvetica');
		if (typeof customizationDetails === 'string') {
			doc.text(customizationDetails);
		} else if (typeof customizationDetails === 'object') {
			Object.entries(customizationDetails).forEach(([key, value]) => {
				doc.text(`${key}: ${value}`);
			});
		}
		doc.moveDown();
	}

	// Add placement information
	if (placementInfo) {
		doc.fontSize(12).font('Helvetica-Bold').text('Placement Information', { underline: true });
		doc.fontSize(10).font('Helvetica');
		if (typeof placementInfo === 'string') {
			doc.text(placementInfo);
		} else if (typeof placementInfo === 'object') {
			Object.entries(placementInfo).forEach(([key, value]) => {
				doc.text(`${key}: ${value}`);
			});
		}
		doc.moveDown();
	}

	// Add colors used
	if (colorsUsed) {
		doc.fontSize(12).font('Helvetica-Bold').text('Colors Used', { underline: true });
		doc.fontSize(10).font('Helvetica');
		if (Array.isArray(colorsUsed)) {
			colorsUsed.forEach((color) => {
				doc.text(`• ${color}`);
			});
		} else if (typeof colorsUsed === 'string') {
			doc.text(colorsUsed);
		}
		doc.moveDown();
	}

	// Add text content
	if (textContent) {
		doc.fontSize(12).font('Helvetica-Bold').text('Text Content', { underline: true });
		doc.fontSize(10).font('Helvetica');
		doc.text(textContent);
		doc.moveDown();
	}

	// Add embroidery settings
	if (embroiderySettings) {
		doc.fontSize(12).font('Helvetica-Bold').text('Embroidery Settings', { underline: true });
		doc.fontSize(10).font('Helvetica');
		if (typeof embroiderySettings === 'string') {
			doc.text(embroiderySettings);
		} else if (typeof embroiderySettings === 'object') {
			Object.entries(embroiderySettings).forEach(([key, value]) => {
				doc.text(`${key}: ${value}`);
			});
		}
		doc.moveDown();
	}

	// Add print settings
	if (printSettings) {
		doc.fontSize(12).font('Helvetica-Bold').text('Print Settings', { underline: true });
		doc.fontSize(10).font('Helvetica');
		if (typeof printSettings === 'string') {
			doc.text(printSettings);
		} else if (typeof printSettings === 'object') {
			Object.entries(printSettings).forEach(([key, value]) => {
				doc.text(`${key}: ${value}`);
			});
		}
		doc.moveDown();
	}

	// Add price breakdown
	if (priceBreakdown) {
		doc.fontSize(12).font('Helvetica-Bold').text('Price Breakdown', { underline: true });
		doc.fontSize(10).font('Helvetica');
		if (typeof priceBreakdown === 'string') {
			doc.text(priceBreakdown);
		} else if (typeof priceBreakdown === 'object') {
			Object.entries(priceBreakdown).forEach(([key, value]) => {
				doc.text(`${key}: ${value}`);
			});
		}
		doc.moveDown();
	}

	// Add total price
	doc.fontSize(12).font('Helvetica-Bold').text(`Total Price: ₹${price || 'N/A'}`, { align: 'right' });

	// Finalize PDF
	doc.end();

	logger.info(`PDF exported for design: ${designId}`);
});

export default router;
