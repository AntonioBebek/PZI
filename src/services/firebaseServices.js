import { 
  signInWithCustomToken,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const API_URL = 'http://localhost:3001/api';

// ==================== HELPER FUNCTIONS ====================

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
};

// ==================== AUTH SERVICE ====================

export const authService = {
  register: async (email, password) => {
    try {
      console.log('🔄 Registering user:', email);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      // Sign in with custom token
      await signInWithCustomToken(auth, data.token);
      const user = auth.currentUser;
      
      console.log('✅ User registered:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      // Sign in with custom token
      await signInWithCustomToken(auth, data.token);
      return auth.currentUser;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

// ==================== TOURS SERVICE ====================

export const toursService = {
  createTour: async (tourData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Morate biti prijavljeni');

      const authToken = await getAuthToken();

      const response = await fetch(`${API_URL}/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tour: {
            title: tourData.title,
            description: tourData.description,
            location: tourData.location,
            category: tourData.category,
            imageUrl: tourData.imageUrl,
            youtubeUrl: tourData.youtubeUrl || '',
            createdByEmail: user.email
          }, 
          authToken 
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      console.log('✅ Tour created:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ Create tour error:', error);
      throw error;
    }
  },

  getAllTours: async () => {
    try {
      const response = await fetch(`${API_URL}/tours`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      console.log(`✅ Loaded ${data.length} tours`);
      return data;
    } catch (error) {
      console.error('❌ Get tours error:', error);
      return [];
    }
  },

  getUserTours: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/tours/user/${userId}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      return data;
    } catch (error) {
      console.error('❌ Get user tours error:', error);
      return [];
    }
  },

  updateTour: async (tourId, updateData) => {
    try {
      const authToken = await getAuthToken();

      const response = await fetch(`${API_URL}/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tour: updateData, authToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      console.log('✅ Tour updated:', tourId);
    } catch (error) {
      console.error('❌ Update tour error:', error);
      throw error;
    }
  },

  deleteTour: async (tourId) => {
    try {
      const authToken = await getAuthToken();

      const response = await fetch(`${API_URL}/tours/${tourId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      console.log('✅ Tour deleted:', tourId);
    } catch (error) {
      console.error('❌ Delete tour error:', error);
      throw error;
    }
  },

  incrementVisitors: async (tourId) => {
    try {
      await fetch(`${API_URL}/tours/${tourId}/visitors`, { 
        method: 'PUT' 
      });
    } catch (error) {
      console.error('❌ Increment visitors error:', error);
    }
  }
};

// ==================== USERS SERVICE ====================

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      return data;
    } catch (error) {
      console.error('❌ Get users error:', error);
      return [];
    }
  },

  getUserProfile: async (uid) => {
    try {
      const response = await fetch(`${API_URL}/users/${uid}`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Get user profile error:', error);
      return null;
    }
  },

  updateUserProfile: async (uid, updateData) => {
    try {
      const authToken = await getAuthToken();

      const response = await fetch(`${API_URL}/users/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateData, authToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      console.log('✅ User updated:', uid);
    } catch (error) {
      console.error('❌ Update user error:', error);
      throw error;
    }
  },

  incrementUserStats: async (uid, field) => {
    // This is now handled automatically on the backend
    // when creating tours or adding reviews
    console.log(`✅ User stats ${field} incremented on backend`);
  },

  ensureUserProfile: async (user) => {
    try {
      const profile = await userService.getUserProfile(user.uid);
      if (!profile) {
        console.log('🔧 User profile not found, backend will create it');
      }
    } catch (error) {
      console.error('❌ Ensure user profile error:', error);
    }
  }
};

// ==================== REVIEWS SERVICE ====================

export const reviewsService = {
  addReview: async (tourId, rating, comment) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Morate biti prijavljeni');

      const authToken = await getAuthToken();

      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review: {
            tourId,
            rating: Number(rating),
            comment: comment || '',
            userEmail: user.email
          },
          authToken
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      console.log('✅ Review added');
    } catch (error) {
      console.error('❌ Add review error:', error);
      throw error;
    }
  },

  getTourReviews: async (tourId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/tour/${tourId}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      return data;
    } catch (error) {
      console.error('❌ Get reviews error:', error);
      return [];
    }
  },

  getUserReviews: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/user/${userId}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      return data;
    } catch (error) {
      console.error('❌ Get user reviews error:', error);
      return [];
    }
  },

  updateTourRating: async (tourId) => {
    // This is now handled automatically on the backend
    // when a review is added
    console.log('✅ Tour rating updated automatically on backend');
  },

  deleteReview: async (reviewId) => {
    try {
      const authToken = await getAuthToken();

      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      console.log('✅ Review deleted');
    } catch (error) {
      console.error('❌ Delete review error:', error);
      throw error;
    }
  },

  markHelpful: async (reviewId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
    } catch (error) {
      console.error('❌ Mark helpful error:', error);
    }
  }
};
