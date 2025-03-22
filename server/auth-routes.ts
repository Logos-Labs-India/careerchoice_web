import { Router } from 'express';
import passport from 'passport';
import { pgStorage } from './pg-storage';
import { z } from 'zod';

// Create a router for authentication routes
const authRouter = Router();

// Route for initiating Google OAuth authentication - only active if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  authRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  // Callback route for Google OAuth - this is where Google will redirect after authentication
  authRouter.get('/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/login',
      session: true
    }),
    (req, res) => {
      // Check if the user profile is complete
      const user = req.user as any;
      
      if (!user) {
        return res.redirect('/login?error=auth_failed');
      }
      
      // If user needs to complete profile (e.g., add phone number, grade), redirect to profile completion
      if (!user.phoneNumber || !user.grade) {
        return res.redirect(`/complete-profile?id=${user.id}`);
      }
      
      // Otherwise, redirect to the dashboard
      res.redirect('/dashboard');
    }
  );
}

// Signup (or login) with email and password
authRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validate request data
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(1),
      lastName: z.string().min(1)
    });
    
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: result.error.errors
      });
    }
    
    // Check if email already exists
    const existingUser = await pgStorage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Create new user
    const newUser = await pgStorage.createUser({
      email,
      password, // In a real app, this would be hashed
      firstName,
      lastName,
      username: email, // Use email as username
      googleId: null,
      phoneNumber: null,
      grade: null,
      school: null,
      occupation: null,
      profilePicture: null
    });
    
    // Log the user in
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to login after signup' });
      }
      
      // Redirect to profile completion
      return res.status(201).json({ 
        id: newUser.id,
        redirectTo: `/complete-profile?id=${newUser.id}`
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Failed to create account' });
  }
});

// Login with email and password
authRouter.post('/login', passport.authenticate('local', {
  failureRedirect: '/login?error=invalid_credentials',
  failureMessage: true
}), (req, res) => {
  const user = req.user as any;
  
  // Update last login time
  pgStorage.updateUserLastLogin(user.id);
  
  // Check if profile is complete
  if (!user.phoneNumber || !user.grade) {
    return res.json({ 
      success: true,
      redirectTo: `/complete-profile?id=${user.id}`
    });
  }
  
  // Redirect to dashboard
  return res.json({ 
    success: true,
    redirectTo: '/dashboard'
  });
});

// Complete profile (add student information)
authRouter.post('/complete-profile', async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = req.user as any;
    const { phoneNumber, grade, school } = req.body;
    
    // Validate request data
    const schema = z.object({
      phoneNumber: z.string().min(10),
      grade: z.string(),
      school: z.string().optional()
    });
    
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: result.error.errors
      });
    }
    
    // Update user profile
    // Note: This would require an updateUser method in the storage interface
    // For now, we're just returning success as a placeholder
    
    return res.json({ 
      success: true,
      redirectTo: '/dashboard'
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Logout
authRouter.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    
    res.json({ success: true });
  });
});

// Check authentication status
authRouter.get('/status', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ 
      authenticated: true,
      user: req.user
    });
  }
  
  return res.json({ authenticated: false });
});

export default authRouter;