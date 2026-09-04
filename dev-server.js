import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();
  
  // Parse JSON bodies
  app.use(express.json());

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // API routes - dynamically import and handle
  app.use('/api', async (req, res, next) => {
    try {
      const apiPath = req.path.replace(/^\//, '');
      const segments = apiPath.split('/').filter(Boolean);
      
      console.log(`[API] ${req.method} ${req.path}`);
      console.log(`[API] Original query:`, req.query);
      console.log(`[API] Full URL:`, req.url);
      
      // Map old routes to new consolidated routes
      let filePath;
      let queryParams = { ...req.query };
      
      // Determine which API file to load based on the path
      if (segments[0] === 'auth') {
        // /api/auth or /api/auth/login -> /api/auth.ts
        filePath = join(__dirname, 'api', 'auth.ts');
        if (segments[1] && !queryParams.action) queryParams.action = segments[1];
      } else if (segments[0] === 'cart') {
        // /api/cart or /api/cart/sync -> /api/cart.ts
        filePath = join(__dirname, 'api', 'cart.ts');
        // Query params like ?action=sync are already in queryParams
        if (segments[1] === 'sync' && !queryParams.action) queryParams.action = 'sync';
      } else if (segments[0] === 'orders') {
        // /api/orders or /api/orders/123 -> /api/orders.ts
        filePath = join(__dirname, 'api', 'orders.ts');
        if (segments[1] && !queryParams.id) queryParams.id = segments[1];
      } else if (segments[0] === 'products') {
        // /api/products or /api/products/123 -> /api/products.ts
        filePath = join(__dirname, 'api', 'products.ts');
        if (segments[1] && !queryParams.id) queryParams.id = segments[1];
      } else if (segments[0] === 'shiprocket') {
        filePath = join(__dirname, 'api', 'shiprocket.ts');
        if (segments[1] === 'webhook' && !queryParams.action) queryParams.action = 'webhook';
      } else if (segments[0] === 'admin') {
        // /api/admin?resource=orders or /api/admin/orders -> /api/admin.ts
        filePath = join(__dirname, 'api', 'admin.ts');
        // Query params like ?resource=orders are already in queryParams
        if (segments[1] && !queryParams.resource) queryParams.resource = segments[1];
        if (segments[2] && !queryParams.id) queryParams.id = segments[2];
      } else if (segments.length === 1) {
        // Direct file access: /api/auth -> /api/auth.ts
        filePath = join(__dirname, 'api', segments[0] + '.ts');
      } else {
        // Unknown route
        console.error(`[API] Unknown route: ${req.path}`);
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `API endpoint not found: ${req.path}`,
          },
        });
      }
      
      console.log(`[API] Loading handler from: ${filePath}`);
      console.log(`[API] Query params:`, queryParams);
      console.log(`[API] __dirname:`, __dirname);

      // Check if file exists
      const fs = await import('fs');
      if (!fs.existsSync(filePath)) {
        console.error(`[API] File not found: ${filePath}`);
        console.error(`[API] Attempted path: ${filePath}`);
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `API endpoint not found: ${req.path}`,
          },
        });
      }

      // Load the API handler
      console.log(`[API] Attempting to load module...`);
      const module = await vite.ssrLoadModule(filePath);
      console.log(`[API] Module loaded, exports:`, Object.keys(module));
      const handler = module.default || module.handler;

      if (!handler) {
        console.error(`[API] No handler found in module`);
        return res.status(500).json({
          error: {
            code: 'INTERNAL_ERROR',
            message: 'API handler not found',
          },
        });
      }

      console.log(`[API] Executing handler...`);
      if (handler) {
        // Create a mock Vercel request/response
        const mockReq = {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
          query: queryParams,
          on: (event, callback) => {
            // Mock event emitter for webhook raw body handling
            if (event === 'data') {
              callback(Buffer.from(JSON.stringify(req.body)));
            } else if (event === 'end') {
              callback();
            }
          },
        };

        let statusCode = 200;
        let responseData = null;
        let responseSent = false;

        const mockRes = {
          status: (code) => {
            statusCode = code;
            return mockRes;
          },
          json: (data) => {
            if (!responseSent) {
              responseSent = true;
              responseData = data;
              res.status(statusCode).json(data);
            }
            return mockRes;
          },
          send: (data) => {
            if (!responseSent) {
              responseSent = true;
              res.status(statusCode).send(data);
            }
            return mockRes;
          },
          setHeader: (name, value) => {
            res.setHeader(name, value);
            return mockRes;
          },
          end: (data) => {
            if (!responseSent) {
              responseSent = true;
              res.status(statusCode).end(data);
            }
          },
        };

        await handler(mockReq, mockRes);
        
        // Ensure response is sent
        if (!responseSent) {
          res.status(statusCode).end();
        }
      } else {
        next();
      }
    } catch (error) {
      console.error('API Error:', error);
      console.error('Stack:', error.stack);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
        },
      });
    }
  });

  // Use vite's connect instance as middleware
  // This handles all static assets and HMR
  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, () => {
    console.log(`\n  🚀 Server running at http://localhost:${port}\n`);
  });
}

createServer();
