import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { filterSchema, insertDoctorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // GET /api/doctors - Get filtered doctors list
  apiRouter.get("/doctors", async (req, res) => {
    try {
      const filterParams = {
        search: req.query.search as string,
        modes: req.query.modes ? (req.query.modes as string).split(",") : undefined,
        experienceRange: req.query.experienceRange 
          ? JSON.parse(req.query.experienceRange as string) 
          : undefined,
        priceRange: req.query.priceRange 
          ? JSON.parse(req.query.priceRange as string) 
          : undefined,
        languages: req.query.languages 
          ? (req.query.languages as string).split(",") 
          : undefined,
        facilities: req.query.facilities 
          ? (req.query.facilities as string).split(",") 
          : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sort: (req.query.sort as any) || "relevance",
      };
      
      // Validate filter parameters
      const validated = filterSchema.parse(filterParams);
      
      // Get filtered doctors
      const result = await storage.getDoctors(validated);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid filter parameters", errors: error.errors });
      } else {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Failed to get doctors", error: String(error) });
      }
    }
  });
  
  // POST /api/doctors - Add a new doctor
  apiRouter.post("/doctors", async (req, res) => {
    try {
      // Validate request body
      const validatedDoctor = insertDoctorSchema.parse(req.body);
      
      // Add doctor to storage
      const doctor = await storage.addDoctor(validatedDoctor);
      
      res.status(201).json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid doctor data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add doctor" });
      }
    }
  });
  
  // Mount API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
