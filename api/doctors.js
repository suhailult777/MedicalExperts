import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

neonConfig.webSocketConstructor = ws;

// Dynamically import schema
let schema;
try {
    const currentFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(currentFilePath), '..');
    const schemaPath = path.join(projectRoot, 'shared', 'schema.js');

    if (fs.existsSync(schemaPath)) {
        schema = await import('../shared/schema.js');
    } else {
        // Fallback for production where file paths might be different
        schema = await import('../dist/shared/schema.js').catch(() => null) ||
            await import('../shared/schema.js').catch(() => {
                console.error('Failed to load schema');
                return { doctors: {} };
            });
    }
} catch (error) {
    console.error('Error loading schema:', error);
    schema = { doctors: {} };
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let doctors = [];
            let total = 0;

            try {
                doctors = await db.query.doctors.findMany({
                    limit,
                    offset
                });

                const countResult = await db.query.doctors.findMany({
                    columns: { id: true }
                });

                total = countResult.length;
            } catch (dbError) {
                console.error('Database query error:', dbError);
                // Return empty results instead of failing
                doctors = [];
                total = 0;
            }

            return res.status(200).json({
                doctors,
                total
            });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
} 