import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Simple handler for server verification
export default async function handler(req, res) {
    try {
        // Test database connection
        const result = await pool.query('SELECT NOW()');

        return res.status(200).json({
            message: 'MedicalExperts API is running',
            dbConnection: 'Success',
            timestamp: result.rows[0].now,
            endpoints: [
                {
                    path: '/api/doctors',
                    description: 'Get all doctors'
                }
            ]
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            dbUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing'
        });
    }
} 