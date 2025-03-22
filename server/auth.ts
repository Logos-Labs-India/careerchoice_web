import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { pgStorage } from './pg-storage';
import { InsertUser } from '@shared/schema';

// Use the PostgreSQL storage
const storage = pgStorage;

// Configure Passport.js
export function setupAuth() {
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error, undefined);
    }
  });

  // Setup Local strategy for username/password login
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          
          // In a real app, we would compare hashed passwords
          // For this demo, we'll do a simple comparison
          if (user.password !== password) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          
          // Update last login time
          const updatedUser = await storage.updateUserLastLogin(user.id);
          return done(null, updatedUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  // Setup Google OAuth strategy if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const existingUser = await storage.getUserByGoogleId(profile.id);
          
          if (existingUser) {
            // Update last login time
            const updatedUser = await storage.updateUserLastLogin(existingUser.id);
            return done(null, updatedUser);
          }
          
          // Extract profile information
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';
          const profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
          
          // Check if email already exists (user might have signed up with different method)
          const userWithEmail = await storage.getUserByEmail(email);
          
          if (userWithEmail) {
            // Update user with Google ID
            // This would require adding an updateUser method to storage interface
            // For now, we'll return an error
            return done(new Error('Email already exists'), undefined);
          }
          
          // Create new user with minimal information
          // The rest of the profile will be completed in the registration step
          const newUser: InsertUser = {
            googleId: profile.id,
            email,
            firstName,
            lastName,
            profilePicture,
            // These fields will be completed during registration
            username: null,
            password: null,
            phoneNumber: null,
            grade: null,
            school: null,
            occupation: null
          };
          
          const createdUser = await storage.createUser(newUser);
          return done(null, createdUser);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
  }

  return passport;
}