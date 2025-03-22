import type { Express } from "express";
import { createServer, type Server } from "http";
import { pgStorage } from "./pg-storage";
import { generatePDF } from "./pdf-generator";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";
import authRouter from "./auth-routes";
import { setupAuth } from "./auth";

// Use PostgreSQL storage for persistence
const storage = pgStorage;

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const httpServer = createServer(app);
  
  // Get user assessment results
  app.get("/api/assessments/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const assessmentResults = await storage.getAssessmentResults(userId);
      return res.status(200).json(assessmentResults);
    } catch (error) {
      console.error("Error fetching assessment results:", error);
      return res.status(500).json({ message: "Failed to fetch assessment results" });
    }
  });

  // Get RIASEC results
  app.get("/api/assessments/:userId/riasec", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const riasecResult = await storage.getRiasecResult(userId);
      if (!riasecResult) {
        return res.status(404).json({ message: "RIASEC results not found" });
      }

      return res.status(200).json(riasecResult);
    } catch (error) {
      console.error("Error fetching RIASEC results:", error);
      return res.status(500).json({ message: "Failed to fetch RIASEC results" });
    }
  });

  // Get Aptitude results
  app.get("/api/assessments/:userId/aptitude", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const aptitudeResult = await storage.getAptitudeResult(userId);
      if (!aptitudeResult) {
        return res.status(404).json({ message: "Aptitude results not found" });
      }

      return res.status(200).json(aptitudeResult);
    } catch (error) {
      console.error("Error fetching Aptitude results:", error);
      return res.status(500).json({ message: "Failed to fetch Aptitude results" });
    }
  });

  // Get OCEAN results
  app.get("/api/assessments/:userId/ocean", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const oceanResult = await storage.getOceanResult(userId);
      if (!oceanResult) {
        return res.status(404).json({ message: "OCEAN results not found" });
      }

      return res.status(200).json(oceanResult);
    } catch (error) {
      console.error("Error fetching OCEAN results:", error);
      return res.status(500).json({ message: "Failed to fetch OCEAN results" });
    }
  });

  // Get career matches
  app.get("/api/assessments/:userId/careers", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const careerMatches = await storage.getCareerMatches(userId);
      return res.status(200).json(careerMatches);
    } catch (error) {
      console.error("Error fetching career matches:", error);
      return res.status(500).json({ message: "Failed to fetch career matches" });
    }
  });

  // Download PDF report
  app.get("/api/assessments/:userId/download", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const assessmentResults = await storage.getAssessmentResults(userId);
      
      // Generate PDF
      const pdfBuffer = await generatePDF(user, assessmentResults);
      
      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="career-assessment-${user.lastName}-${user.firstName}.pdf"`);
      
      // Send the PDF buffer
      return res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      return res.status(500).json({ message: "Failed to generate PDF report" });
    }
  });

  // Add to waitlist
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body
      const parseResult = insertWaitlistSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid waitlist data", 
          errors: parseResult.error.errors 
        });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(parseResult.data.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      // Add to waitlist
      const waitlistEntry = await storage.addToWaitlist(parseResult.data);
      
      return res.status(201).json({ 
        message: "Successfully added to waitlist",
        id: waitlistEntry.id
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      return res.status(500).json({ message: "Failed to add to waitlist" });
    }
  });

  return httpServer;
}
