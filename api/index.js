export { default as doctors } from './doctors.js';

export default function handler(req, res) {
    res.status(200).json({
        message: 'MedicalExperts API is running',
        endpoints: [
            {
                path: '/api/doctors',
                description: 'Get all doctors'
            }
        ]
    });
} 