import { eq } from 'drizzle-orm';
import { 
  User, InsertUser, 
  RiasecResult, InsertRiasecResult,
  AptitudeResult, InsertAptitudeResult,
  OceanResult, InsertOceanResult,
  WaitlistEntry, InsertWaitlistEntry,
  Career, AssessmentResults,
} from '@shared/schema';
import { IStorage } from './storage';
import { db } from './db';
import { 
  users, riasecResults, aptitudeResults, oceanResults, 
  waitlist, careers, careerMatches 
} from '@shared/schema';

export class PgStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...user,
      createdAt: new Date(),
      lastLogin: new Date(),
    }).returning();
    return result[0];
  }
  
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const result = await db.insert(waitlist).values({
      ...entry,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db.select().from(waitlist);
  }

  async saveRiasecResult(result: InsertRiasecResult): Promise<RiasecResult> {
    // First check if a result already exists for this user
    const existingResult = await db
      .select()
      .from(riasecResults)
      .where(eq(riasecResults.userId, result.userId));
    
    if (existingResult.length > 0) {
      // Update existing result
      const updatedResult = await db
        .update(riasecResults)
        .set({
          ...result,
          completedAt: new Date(),
        })
        .where(eq(riasecResults.userId, result.userId))
        .returning();
      return updatedResult[0];
    } else {
      // Insert new result
      const newResult = await db
        .insert(riasecResults)
        .values({
          ...result,
          completedAt: new Date(),
        })
        .returning();
      return newResult[0];
    }
  }

  async saveAptitudeResult(result: InsertAptitudeResult): Promise<AptitudeResult> {
    // First check if a result already exists for this user
    const existingResult = await db
      .select()
      .from(aptitudeResults)
      .where(eq(aptitudeResults.userId, result.userId));
    
    if (existingResult.length > 0) {
      // Update existing result
      const updatedResult = await db
        .update(aptitudeResults)
        .set({
          ...result,
          completedAt: new Date(),
        })
        .where(eq(aptitudeResults.userId, result.userId))
        .returning();
      return updatedResult[0];
    } else {
      // Insert new result
      const newResult = await db
        .insert(aptitudeResults)
        .values({
          ...result,
          completedAt: new Date(),
        })
        .returning();
      return newResult[0];
    }
  }

  async saveOceanResult(result: InsertOceanResult): Promise<OceanResult> {
    // First check if a result already exists for this user
    const existingResult = await db
      .select()
      .from(oceanResults)
      .where(eq(oceanResults.userId, result.userId));
    
    if (existingResult.length > 0) {
      // Update existing result
      const updatedResult = await db
        .update(oceanResults)
        .set({
          ...result,
          completedAt: new Date(),
        })
        .where(eq(oceanResults.userId, result.userId))
        .returning();
      return updatedResult[0];
    } else {
      // Insert new result
      const newResult = await db
        .insert(oceanResults)
        .values({
          ...result,
          completedAt: new Date(),
        })
        .returning();
      return newResult[0];
    }
  }

  async getRiasecResult(userId: number): Promise<RiasecResult | null> {
    const result = await db
      .select()
      .from(riasecResults)
      .where(eq(riasecResults.userId, userId));
    return result[0] || null;
  }

  async getAptitudeResult(userId: number): Promise<AptitudeResult | null> {
    const result = await db
      .select()
      .from(aptitudeResults)
      .where(eq(aptitudeResults.userId, userId));
    return result[0] || null;
  }

  async getOceanResult(userId: number): Promise<OceanResult | null> {
    const result = await db
      .select()
      .from(oceanResults)
      .where(eq(oceanResults.userId, userId));
    return result[0] || null;
  }

  async getAssessmentResults(userId: number): Promise<AssessmentResults> {
    // Get user's assessment results
    const [riasec, aptitude, ocean] = await Promise.all([
      this.getRiasecResult(userId),
      this.getAptitudeResult(userId),
      this.getOceanResult(userId),
    ]);

    // Get career matches
    const careerMatchResults = await this.getCareerMatches(userId);

    return {
      riasec,
      aptitude,
      ocean,
      careerMatches: careerMatchResults,
    };
  }

  async getCareers(): Promise<Career[]> {
    return await db.select().from(careers);
  }

  async getCareerMatches(userId: number): Promise<{
    title: string;
    description: string;
    matchPercentage: number;
    traits: string[];
  }[]> {
    // Get all results for this user
    const [riasec, aptitude, ocean] = await Promise.all([
      this.getRiasecResult(userId),
      this.getAptitudeResult(userId),
      this.getOceanResult(userId),
    ]);

    // Get matching careers from the database
    const matches = await db
      .select()
      .from(careerMatches)
      .leftJoin(careers, eq(careerMatches.careerId, careers.id))
      .where(eq(careerMatches.userId, userId));

    if (matches.length > 0) {
      return matches.map(match => ({
        title: match.careers.title,
        description: match.careers.description,
        matchPercentage: match.careerMatches.matchPercentage,
        traits: match.careers.traits,
      }));
    }

    // If no matches exist, calculate some based on the highest scores
    // This is a simplified example - in a real app, this would be more sophisticated
    const allCareers = await this.getCareers();
    
    // Create a sample career match calculation based on the strongest traits
    return this.generateCareerMatches(riasec, aptitude, ocean, allCareers);
  }

  private generateCareerMatches(
    riasec?: RiasecResult | null,
    aptitude?: AptitudeResult | null,
    ocean?: OceanResult | null,
    allCareers?: Career[]
  ) {
    // Simple matching algorithm for demo purposes
    // In a real app, this would be much more sophisticated
    const matches: {
      title: string;
      description: string;
      matchPercentage: number;
      traits: string[];
    }[] = [];

    if (!allCareers || allCareers.length === 0) {
      return matches;
    }

    // Create some sample matches based on the top RIASEC traits
    if (riasec) {
      const riasecScores = [
        { key: 'realistic', score: riasec.realistic },
        { key: 'investigative', score: riasec.investigative },
        { key: 'artistic', score: riasec.artistic },
        { key: 'social', score: riasec.social },
        { key: 'enterprising', score: riasec.enterprising },
        { key: 'conventional', score: riasec.conventional },
      ];

      // Sort by highest scores
      riasecScores.sort((a, b) => b.score - a.score);
      
      // Take top 2 RIASEC types
      const topTypes = riasecScores.slice(0, 2).map(item => item.key);
      
      // Filter careers that match the top types
      const matchingCareers = allCareers.filter(career => {
        const traits = career.traits;
        return topTypes.some(type => traits.includes(type.charAt(0).toUpperCase() + type.slice(1)));
      });

      // Return top matches
      for (const career of matchingCareers.slice(0, 5)) {
        const matchScore = Math.floor(70 + Math.random() * 25); // Random match percentage between 70-95
        matches.push({
          title: career.title,
          description: career.description,
          matchPercentage: matchScore,
          traits: career.traits,
        });
      }
    }

    // If we don't have enough matches yet, add some based on aptitude or OCEAN
    if (matches.length < 5 && aptitude) {
      // Implementation would typically check aptitude scores against career requirements
      // Simplified for demo purposes
    }

    return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}

// Export an instance of the PostgreSQL storage
export const pgStorage = new PgStorage();