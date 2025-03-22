import {
  User,
  InsertUser,
  WaitlistEntry,
  InsertWaitlistEntry,
  RiasecResult,
  InsertRiasecResult,
  AptitudeResult,
  InsertAptitudeResult,
  OceanResult,
  InsertOceanResult,
  AssessmentResults,
  Career
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;

  // Waitlist operations
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;

  // Assessment results operations
  saveRiasecResult(result: InsertRiasecResult): Promise<RiasecResult>;
  saveAptitudeResult(result: InsertAptitudeResult): Promise<AptitudeResult>;
  saveOceanResult(result: InsertOceanResult): Promise<OceanResult>;
  
  getRiasecResult(userId: number): Promise<RiasecResult | null>;
  getAptitudeResult(userId: number): Promise<AptitudeResult | null>;
  getOceanResult(userId: number): Promise<OceanResult | null>;
  
  getAssessmentResults(userId: number): Promise<AssessmentResults>;
  
  // Career operations
  getCareers(): Promise<Career[]>;
  getCareerMatches(userId: number): Promise<{
    title: string;
    description: string;
    matchPercentage: number;
    traits: string[];
  }[]>;
}

// Career match traits
type TraitTag = "Investigative" | "Social" | "Artistic" | "Realistic" | "Enterprising" | "Conventional" 
  | "Numerical" | "Verbal" | "Logical" | "Spatial" | "Mechanical"
  | "Openness" | "Conscientiousness" | "Extraversion" | "Agreeableness" | "Analytical";

// Sample career data
const sampleCareers = [
  {
    id: 1,
    title: "Data Scientist",
    description: "Analyze complex data sets to identify patterns and insights using statistical methods and machine learning.",
    matchPercentage: 92,
    traits: ["Investigative", "Logical", "Numerical"] as TraitTag[]
  },
  {
    id: 2,
    title: "Research Scientist",
    description: "Conduct research to expand knowledge in a specific field, develop theories, and publish findings.",
    matchPercentage: 88,
    traits: ["Investigative", "Openness", "Analytical"] as TraitTag[]
  },
  {
    id: 3,
    title: "Technical Writer",
    description: "Create clear documentation for technical products, processes, and services.",
    matchPercentage: 85,
    traits: ["Conventional", "Verbal", "Conscientiousness"] as TraitTag[]
  },
  {
    id: 4,
    title: "UX Researcher",
    description: "Study user behavior and needs to inform product development and design decisions.",
    matchPercentage: 82,
    traits: ["Social", "Investigative", "Agreeableness"] as TraitTag[]
  }
];

// Sample assessment data
const sampleRiasecData = {
  realistic: 65,
  investigative: 82,
  artistic: 45,
  social: 70,
  enterprising: 55,
  conventional: 40
};

const sampleAptitudeData = {
  numerical: 75,
  verbal: 82,
  spatial: 60,
  logical: 88, 
  mechanical: 50
};

const sampleOceanData = {
  openness: 85,
  conscientiousness: 70,
  extraversion: 55,
  agreeableness: 75,
  neuroticism: 40
};

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, WaitlistEntry>;
  private riasecResults: Map<number, RiasecResult>;
  private aptitudeResults: Map<number, AptitudeResult>;
  private oceanResults: Map<number, OceanResult>;
  private currentUserId: number;
  private currentWaitlistId: number;
  private currentRiasecId: number;
  private currentAptitudeId: number;
  private currentOceanId: number;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.riasecResults = new Map();
    this.aptitudeResults = new Map();
    this.oceanResults = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
    this.currentRiasecId = 1;
    this.currentAptitudeId = 1;
    this.currentOceanId = 1;
    
    // Add demo user with sample data
    this.createDemoUser();
  }

  // Create a demo user with sample assessment data
  private async createDemoUser() {
    const demoUser = await this.createUser({
      username: "demo_user",
      password: "password123",
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
      occupation: "Student",
      googleId: null,
      phoneNumber: null,
      grade: null,
      school: null,
      profilePicture: null
    });
    
    await this.saveRiasecResult({
      userId: demoUser.id,
      ...sampleRiasecData
    });
    
    await this.saveAptitudeResult({
      userId: demoUser.id,
      ...sampleAptitudeData
    });
    
    await this.saveOceanResult({
      userId: demoUser.id,
      ...sampleOceanData
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    // Ensure all fields conform to the expected types
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      lastLogin: now,
      occupation: insertUser.occupation || null,
      phoneNumber: insertUser.phoneNumber || null,
      grade: insertUser.grade || null,
      school: insertUser.school || null,
      profilePicture: insertUser.profilePicture || null,
      googleId: insertUser.googleId || null,
      username: insertUser.username || null,
      password: insertUser.password || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      lastLogin: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Waitlist operations
  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentWaitlistId++;
    const now = new Date();
    // Ensure all fields conform to the expected types
    const waitlistEntry: WaitlistEntry = { 
      ...entry, 
      id, 
      createdAt: now,
      occupation: entry.occupation || null,
      interests: entry.interests || null,
      newsletter: entry.newsletter || null
    };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlist.values());
  }

  // Assessment results operations
  async saveRiasecResult(result: InsertRiasecResult): Promise<RiasecResult> {
    const id = this.currentRiasecId++;
    const now = new Date();
    const riasecResult: RiasecResult = { ...result, id, completedAt: now };
    this.riasecResults.set(result.userId, riasecResult);
    return riasecResult;
  }

  async saveAptitudeResult(result: InsertAptitudeResult): Promise<AptitudeResult> {
    const id = this.currentAptitudeId++;
    const now = new Date();
    const aptitudeResult: AptitudeResult = { ...result, id, completedAt: now };
    this.aptitudeResults.set(result.userId, aptitudeResult);
    return aptitudeResult;
  }

  async saveOceanResult(result: InsertOceanResult): Promise<OceanResult> {
    const id = this.currentOceanId++;
    const now = new Date();
    const oceanResult: OceanResult = { ...result, id, completedAt: now };
    this.oceanResults.set(result.userId, oceanResult);
    return oceanResult;
  }

  async getRiasecResult(userId: number): Promise<RiasecResult | null> {
    return this.riasecResults.get(userId) || null;
  }

  async getAptitudeResult(userId: number): Promise<AptitudeResult | null> {
    return this.aptitudeResults.get(userId) || null;
  }

  async getOceanResult(userId: number): Promise<OceanResult | null> {
    return this.oceanResults.get(userId) || null;
  }

  async getAssessmentResults(userId: number): Promise<AssessmentResults> {
    const riasec = await this.getRiasecResult(userId);
    const aptitude = await this.getAptitudeResult(userId);
    const ocean = await this.getOceanResult(userId);
    const careerMatches = await this.getCareerMatches(userId);
    
    return {
      riasec,
      aptitude,
      ocean,
      careerMatches: careerMatches || null
    };
  }

  // Career operations
  async getCareers(): Promise<Career[]> {
    return [] as Career[];
  }

  async getCareerMatches(userId: number): Promise<{
    title: string;
    description: string;
    matchPercentage: number;
    traits: string[];
  }[]> {
    // In a real application, we would calculate matches based on the user's assessment results
    // For this demo, we're returning sample career matches
    return sampleCareers;
  }
}

export const storage = new MemStorage();
