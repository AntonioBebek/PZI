import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fetch from 'node-fetch';


const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Firebase Admin init
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

// Helper to verify token
const verifyAuth = async (authToken) => {
  if (!authToken) throw new Error('Auth token required');
  return await admin.auth().verifyIdToken(authToken);
};

// ==================== AUTH ====================

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userRecord = await admin.auth().createUser({ email, password, emailVerified: false });

    await db.collection('users').add({
      uid: userRecord.uid,
      email: userRecord.email,
      role: email === 'admin@fpmoz.sum.ba' ? 'admin' : 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      tourCount: 0,
      reviewCount: 0,
      status: 'active'
    });

    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.json({ success: true, token: customToken, uid: userRecord.uid });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.VITE_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || 'Login failed' });
    }

    const customToken = await admin.auth().createCustomToken(data.localId);

    res.json({ success: true, token: customToken, uid: data.localId, email: data.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TOURS ====================

app.get('/api/tours', async (req, res) => {
  try {
    const snapshot = await db.collection('tours').where('status', '==', 'active').get();
    const tours = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(tours);
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tours', async (req, res) => {
  const { tour, authToken } = req.body;
  
  try {
    const decodedToken = await verifyAuth(authToken);
    
    const docRef = await db.collection('tours').add({
      ...tour,
      createdBy: decodedToken.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      visitors: 0,
      rating: 0,
      reviewCount: 0,
      status: 'active'
    });
    
    // Increment user tourCount
    const userSnapshot = await db.collection('users').where('uid', '==', decodedToken.uid).get();
    if (!userSnapshot.empty) {
      await userSnapshot.docs[0].ref.update({
        tourCount: admin.firestore.FieldValue.increment(1)
      });
    }
    
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tours/:id', async (req, res) => {
  const { id } = req.params;
  const { tour, authToken } = req.body;
  
  try {
    await verifyAuth(authToken);
    await db.collection('tours').doc(id).update(tour);
    res.json({ success: true });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tours/:id', async (req, res) => {
  const { id } = req.params;
  const { authToken } = req.body;
  
  try {
    await verifyAuth(authToken);
    await db.collection('tours').doc(id).update({
      status: 'deleted',
      deletedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tours/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const snapshot = await db.collection('tours')
      .where('createdBy', '==', userId)
      .where('status', '==', 'active')
      .get();
    
    const tours = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));
    
    res.json(tours);
  } catch (error) {
    console.error('Get user tours error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tours/:id/visitors', async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.collection('tours').doc(id).update({
      visitors: admin.firestore.FieldValue.increment(1)
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Increment visitors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== REVIEWS ====================

app.get('/api/reviews/tour/:tourId', async (req, res) => {
  const { tourId } = req.params;
  
  try {
    const snapshot = await db.collection('reviews')
      .where('tourId', '==', tourId)
      .get();
    
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { review, authToken } = req.body;
  
  try {
    const decodedToken = await verifyAuth(authToken);
    
    // Check if user already reviewed this tour
    const existingReview = await db.collection('reviews')
      .where('tourId', '==', review.tourId)
      .where('userId', '==', decodedToken.uid)
      .get();
    
    if (!existingReview.empty) {
      return res.status(400).json({ error: 'Već ste ocijenili ovu turu' });
    }
    
    await db.collection('reviews').add({
      ...review,
      userId: decodedToken.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      helpful: 0
    });
    
    // Update tour rating
    const allReviews = await db.collection('reviews')
      .where('tourId', '==', review.tourId)
      .get();
    
    const ratings = allReviews.docs.map(doc => doc.data().rating);
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    
    await db.collection('tours').doc(review.tourId).update({
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: ratings.length
    });
    
    // Increment user reviewCount
    const userSnapshot = await db.collection('users').where('uid', '==', decodedToken.uid).get();
    if (!userSnapshot.empty) {
      await userSnapshot.docs[0].ref.update({
        reviewCount: admin.firestore.FieldValue.increment(1)
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USERS ====================

app.get('/api/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('status', '==', 'active').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  const { uid } = req.params;
  
  try {
    const snapshot = await db.collection('users').where('uid', '==', uid).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userDoc = snapshot.docs[0];
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Proxy server radi na portu ${PORT}`);
});
