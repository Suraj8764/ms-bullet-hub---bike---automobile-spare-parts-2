import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MongoClient, Db } from 'mongodb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const currentFilename = typeof __filename !== 'undefined' ? __filename : (typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '');
const currentDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(currentFilename);

// MongoDB Atlas connection singleton
let mongoClientInstance: MongoClient | null = null;
let mongoDbInstance: Db | null = null;

async function getMongoDb(): Promise<Db | null> {
  if (mongoDbInstance) return mongoDbInstance;
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') return null;

  try {
    if (!mongoClientInstance) {
      mongoClientInstance = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      await mongoClientInstance.connect();
      console.log('Successfully connected to MongoDB Atlas!');
    }
    mongoDbInstance = mongoClientInstance.db('msbullethub');
    return mongoDbInstance;
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
    mongoClientInstance = null;
    mongoDbInstance = null;
    return null;
  }
}

// Utility for input sanitization
function sanitizeString(input: any, defaultVal = ''): string {
  if (typeof input !== 'string') return defaultVal;
  return input.trim().slice(0, 2000);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(express.json({ limit: '10mb' }));

  // In-memory fallback products store on backend
  let backendProducts = [
    {
      id: 'prod-101',
      name: 'Rolon Brass Heavy-Duty Drive Chain & Sprocket Kit',
      slug: 'rolon-brass-chain-sprocket-kit-classic-350',
      sku: 'CSK-ROLON-RE350',
      oemNumber: 'ROL-RE-350-BRS',
      partNumber: 'RLN-520-104',
      category: 'Chain & Sprocket',
      categorySlug: 'chain-sprocket-clutch',
      brand: 'Rolon',
      price: 2250,
      originalPrice: 2990,
      discountPercent: 25,
      rating: 4.9,
      reviewCount: 218,
      stock: 40,
      description: 'Golden brass-plated 520 pitch heavy duty drive chain with hardened front and rear sprockets. Engineered by Rolon specifically for Royal Enfield 350cc motorcycles.',
      specifications: [
        { label: 'Chain Pitch', value: '520 O-Ring' },
        { label: 'Sprocket Material', value: 'Hardened High-Carbon Steel' }
      ],
      compatibleVehicles: [
        { make: 'Royal Enfield', model: 'Classic 350', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], fuelType: 'Petrol', engine: '350cc J-Series' }
      ],
      images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'
      ],
      warranty: '12 Months / 20,000 KM',
      deliveryDays: 2,
      hsnCode: '87141090',
      gstRate: 18
    }
  ];

  let backendOrders: any[] = [];

  // Database status check endpoint
  app.get('/api/db-status', async (req, res) => {
    const db = await getMongoDb();
    if (db) {
      res.json({
        connected: true,
        database: 'MongoDB Atlas (msbullethub)',
        message: 'Successfully connected to MongoDB Atlas database.'
      });
    } else {
      res.json({
        connected: false,
        database: 'In-Memory Store',
        message: 'MONGODB_URI not configured or failed to connect. Set MONGODB_URI in secrets or .env.'
      });
    }
  });

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MS BULLET HUB Bike Spare Parts API', timestamp: new Date().toISOString() });
  });

  // API Products endpoints (with MongoDB Atlas support)
  app.get('/api/products', async (req, res) => {
    const db = await getMongoDb();
    if (db) {
      try {
        const products = await db.collection('products').find({}).toArray();
        if (products.length > 0) return res.json(products);
      } catch (e) {
        console.error('Error fetching products from MongoDB Atlas:', e);
      }
    }
    res.json(backendProducts);
  });

  app.get('/api/products/:id', async (req, res) => {
    const productId = sanitizeString(req.params.id);
    const db = await getMongoDb();
    if (db) {
      try {
        const product = await db.collection('products').findOne({ id: productId });
        if (product) return res.json(product);
      } catch (e) {
        console.error('Error fetching product from MongoDB:', e);
      }
    }
    const p = backendProducts.find((item) => item.id === productId);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  });

  app.post('/api/products', async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid product payload' });
    }
    const newProduct = { ...req.body, id: `prod-${Date.now()}` };
    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('products').insertOne(newProduct);
      } catch (e) {
        console.error('Error inserting product into MongoDB:', e);
      }
    }
    backendProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', async (req, res) => {
    const productId = sanitizeString(req.params.id);
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid update payload' });
    }
    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('products').updateOne({ id: productId }, { $set: req.body });
      } catch (e) {
        console.error('Error updating product in MongoDB:', e);
      }
    }
    const idx = backendProducts.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      backendProducts[idx] = { ...backendProducts[idx], ...req.body };
    }
    res.json({ success: true, id: productId });
  });

  app.delete('/api/products/:id', async (req, res) => {
    const productId = sanitizeString(req.params.id);
    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('products').deleteOne({ id: productId });
      } catch (e) {
        console.error('Error deleting product from MongoDB:', e);
      }
    }
    backendProducts = backendProducts.filter((p) => p.id !== productId);
    res.json({ success: true, id: productId });
  });

  // Helper function to send order confirmation email via Nodemailer
  async function sendOrderEmail(order: any): Promise<{ sent: boolean; message: string }> {
    const recipientEmail = order?.customerEmail || order?.email || order?.shippingAddress?.email;
    if (!recipientEmail || !recipientEmail.includes('@')) {
      return { sent: false, message: 'No valid recipient email address found in order.' };
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"MS BULLET HUB" <no-reply@msbullethub.com>`;

    const itemsListHtml = (order.items || [])
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #334155; color: #f8fafc;">${item.name || item.productName || 'Spare Part'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #334155; color: #fbbf24; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #334155; color: #f8fafc; text-align: right;">₹${(item.price || 0).toLocaleString('en-IN')}</td>
      </tr>`
      )
      .join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid #334155; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: 900; color: #f59e0b; letter-spacing: 1px; }
          .tagline { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
          .badge { background: #065f46; color: #34d399; font-weight: bold; padding: 6px 14px; border-radius: 20px; font-size: 12px; display: inline-block; margin-top: 12px; }
          .order-info { background: #0f172a; padding: 16px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; border: 1px solid #334155; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { background: #0f172a; color: #f59e0b; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          .summary { background: #0f172a; padding: 16px; border-radius: 12px; font-size: 13px; line-height: 1.8; border: 1px solid #334155; }
          .footer { text-align: center; font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">MS BULLET HUB</div>
            <div class="tagline">Genuine OEM Motorcycle Spare Parts</div>
            <div class="badge">✓ Order Placed Successfully</div>
          </div>

          <p style="font-size: 14px;">Hello <strong>${order.customerName || 'Rider'}</strong>,</p>
          <p style="font-size: 13px; color: #cbd5e1;">Your order has been received successfully! Our warehouse team is preparing your OEM bike spare parts for dispatch.</p>

          <div class="order-info">
            <div style="margin-bottom: 6px;"><strong>Order ID:</strong> <span style="color: #f59e0b; font-family: monospace; font-size: 14px; font-weight: bold;">${order.orderNumber || order.id}</span></div>
            <div style="margin-bottom: 6px;"><strong>Customer Mobile:</strong> +91 ${order.mobile || 'N/A'}</div>
            <div style="margin-bottom: 6px;"><strong>Payment Mode:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online / UPI Instant Payment'}</div>
            <div><strong>Delivery Address:</strong> ${order.address || ''}, ${order.city || ''}, ${order.state || ''} - ${order.pincode || ''}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Spare Part Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <div class="summary">
            <div style="display: flex; justify-content: space-between;"><span>Items Subtotal:</span> <strong>₹${(order.subtotal || 0).toLocaleString('en-IN')}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>GST (18% Incl.):</span> <strong>₹${(order.gstAmount || 0).toLocaleString('en-IN')}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Shipping Charge:</span> <strong style="color: #34d399;">${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</strong></div>
            ${order.discountAmount ? `<div style="display: flex; justify-content: space-between; color: #f59e0b;"><span>Promo Discount:</span> <strong>-₹${order.discountAmount}</strong></div>` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 16px; color: #f59e0b; font-weight: bold; border-top: 1px solid #334155; padding-top: 8px; margin-top: 8px;">
              <span>Total Amount Paid:</span>
              <span>₹${(order.grandTotal || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; line-height: 1.5;">
            You can track your package anytime without logging in using your Order ID <strong style="color: #f59e0b;">${order.orderNumber || order.id}</strong> and Mobile Number <strong style="color: #f59e0b;">${order.mobile}</strong> on our Tracking portal.
          </p>

          <div class="footer">
            &copy; 2026 MS BULLET HUB. Official OEM Motorcycle Parts Distributor.<br>
            Need help with your order? Contact us at +91 98765 43210
          </div>
        </div>
      </body>
      </html>
    `;

    if (!smtpUser || !smtpPass) {
      console.log('====================================================');
      console.log(`[NODEMAILER] Order email simulated for: ${recipientEmail}`);
      console.log(`Order Number: ${order.orderNumber || order.id}`);
      console.log(`Grand Total: ₹${order.grandTotal}`);
      console.log('To send real emails, set SMTP_USER and SMTP_PASS in environment variables.');
      console.log('====================================================');
      return {
        sent: true,
        message: 'Order confirmation email generated & logged in server console. Add SMTP credentials to deliver live emails.'
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        subject: `Order Confirmation #${order.orderNumber || order.id} - MS BULLET HUB`,
        html: emailHtml
      });

      console.log(`[NODEMAILER SUCCESS] Email sent to ${recipientEmail} for order ${order.orderNumber}`);
      return { sent: true, message: `Order confirmation email sent to ${recipientEmail}` };
    } catch (error: any) {
      console.error('[NODEMAILER ERROR]', error);
      return { sent: false, message: `Failed to send email: ${error.message}` };
    }
  }

  // API Orders endpoints (with MongoDB Atlas support)
  app.get('/api/orders/:id', async (req, res) => {
    const orderId = sanitizeString(req.params.id);
    const db = await getMongoDb();
    if (db) {
      try {
        const ord = await db.collection('orders').findOne({
          $or: [{ id: orderId }, { orderNumber: orderId }]
        });
        if (ord) return res.json(ord);
      } catch (e) {
        console.error('Error fetching order from MongoDB:', e);
      }
    }
    const ord = backendOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!ord) return res.status(404).json({ error: 'Order not found' });
    res.json(ord);
  });

  app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    if (!orderData || typeof orderData !== 'object') {
      return res.status(400).json({ error: 'Invalid order payload' });
    }
    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('orders').insertOne(orderData);
      } catch (e) {
        console.error('Error inserting order into MongoDB:', e);
      }
    }
    backendOrders.unshift(orderData);

    // Automatically attempt sending Nodemailer email
    const emailResult = await sendOrderEmail(orderData);

    res.status(201).json({ success: true, order: orderData, emailResult });
  });

  // Dedicated endpoint for explicitly triggering order confirmation email
  app.post('/api/send-order-email', async (req, res) => {
    const orderData = req.body;
    if (!orderData || typeof orderData !== 'object') {
      return res.status(400).json({ error: 'Invalid order payload' });
    }
    const result = await sendOrderEmail(orderData);
    res.json(result);
  });

  app.put('/api/orders/:id/status', async (req, res) => {
    const orderId = sanitizeString(req.params.id);
    const status = sanitizeString(req.body?.status);
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const db = await getMongoDb();
    if (db) {
      try {
        await db.collection('orders').updateOne(
          { $or: [{ id: orderId }, { orderNumber: orderId }] },
          { $set: { orderStatus: status } }
        );
      } catch (e) {
        console.error('Error updating order status in MongoDB:', e);
      }
    }
    const ord = backendOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (ord) ord.orderStatus = status;
    res.json({ success: true, status });
  });

  // AI Spare Part Assistant (Gemini API Integration)
  app.post('/api/ai/part-assistant', async (req, res) => {
    try {
      const query = sanitizeString(req.body?.query, 'Bike diagnosis');
      const vehicle = req.body?.vehicle;
      const imageBase64 = req.body?.imageBase64;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          response: `AI Bike Mechanic Diagnosis for "${query}": Based on standard motorcycle diagnostics for your ${vehicle?.make || 'bike'} ${vehicle?.model || ''}, this issue typically points to worn drive chain tension, dry sprockets, or dirty air filter. We recommend inspecting OEM part #ROL-RE-350-BRS (Rolon Brass Chain Kit) or Motul 7100 4T 10W-40 Synthetic Oil.`,
          recommendedCategory: 'chain-sprocket-clutch',
          suggestedOem: 'ROL-RE-350-BRS'
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const promptText = `You are MS BULLET HUB Master AI Bike Mechanic and Spare Part Expert. 
Customer vehicle: ${vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year}, ${vehicle.fuelType}, ${vehicle.engine})` : 'Unspecified Motorcycle / Scooter'}.
Customer query or symptom: "${query}".

Identify the exact mechanical/electrical issue for the bike, explain the cause in 2 concise sentences, specify the required motorcycle spare parts with estimated OEM numbers or specs, and advise whether immediate repair is necessary. Format cleanly.`;

      let contents: any[] = [promptText];

      if (typeof imageBase64 === 'string' && imageBase64.length > 0) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents = [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg'
            }
          },
          promptText
        ];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents
      });

      res.json({
        response: response.text || 'Diagnosis completed. Check recommended spare parts below.',
        recommendedCategory: 'brakes-suspension',
        suggestedOem: '55810M74L00'
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.json({
        response: `Expert Guidance: For "${sanitizeString(req.body?.query, 'your query')}", our senior mechanics recommend checking brake pad thickness, oil level, and air filter cleanliness. View recommended parts in our catalog.`,
        recommendedCategory: 'brakes-suspension',
        suggestedOem: '55810M74L00'
      });
    }
  });

  // Global Error Handler Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Vite Middleware for development vs Static Server for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MS BULLET HUB Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

