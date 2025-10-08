import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Star, Eye } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Dodajte ovo
import { db } from '../firebase'; // Dodajte ovo
import { toursService } from '../services/firebaseServices';
import { useAuth } from '../context/AuthContext';
import TourForm from '../components/tours/TourForm';

const MyTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const { user } = useAuth();

  // REAL-TIME LISTENER za korisničke ture
  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up MyTours real-time listener...');
    
    // Jednostavan query samo sa where filter - NE TREBA INDEX!
    const q = query(
      collection(db, 'tours'),
      where('createdBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userTours = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          };
        })
        .filter(tour => tour.status === 'active') // Client-side filter
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Client-side sort
      
      console.log('✅ MyTours updated via real-time listener:', userTours.length);
      setTours(userTours);
      setLoading(false);
    });

    return () => {
      console.log('🛑 Cleaning up MyTours real-time listener');
      unsubscribe();
    };
  }, [user]);

  const handleAddTour = () => {
    setSelectedTour(null);
    setShowModal(true);
  };

  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Jeste li sigurni da želite izbrisati ovu turu?')) {
      try {
        await toursService.deleteTour(tourId);
        // Real-time listener će automatski ažurirati listu!
        alert('Tura je uspješno obrisana!');
      } catch (error) {
        console.error('Greška pri brisanju ture:', error);
        alert('Greška pri brisanju ture');
      }
    }
  };

  const handleSaveTour = async (tourData) => {
    try {
      if (selectedTour) {
        await toursService.updateTour(selectedTour.id, tourData);
      } else {
        await toursService.createTour(tourData);
      }
      // Real-time listener će automatski ažurirati listu!
      setShowModal(false);
      setSelectedTour(null);
      alert(selectedTour ? 'Tura je uspješno ažurirana!' : 'Tura je uspješno dodana!');
    } catch (error) {
      console.error('Greška pri spremanju ture:', error);
      alert('Greška pri spremanju ture');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Molimo prijavite se</h2>
          <p className="text-white/70">Da biste vidjeli svoje ture, morate biti prijavljeni.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Moje ture</h1>
            <p className="text-white/70">
              Upravljajte vašim turama • 🔴 Real-time ažuriranje aktivno
            </p>
          </div>
          
          <button
            onClick={handleAddTour}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Dodaj novu turu
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-16">
            <div className="card inline-block max-w-md">
              <div className="text-8xl mb-6">🏔️</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Nema dodanih tura</h3>
              <p className="text-gray-600 text-lg mb-8">Počnite dodavanjem vaše prve ture!</p>
              <button
                onClick={handleAddTour}
                className="btn-primary"
              >
                Dodaj prvu turu
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="card hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48 overflow-hidden rounded-xl mb-4">
                  <img
                    src={tour.imageUrl || 'https://via.placeholder.com/400x300?text=Nema+slike'}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-800">{tour.title}</h3>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {tour.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTour(tour)}
                        className="btn-secondary text-blue-600 hover:text-blue-700 p-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTour(tour.id)}
                        className="btn-secondary text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {tour.youtubeUrl && (
                      <a
                        href={tour.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-red-600 hover:text-red-700 px-3 py-2 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <TourForm
            isOpen={showModal}
            tour={selectedTour}
            onClose={() => setShowModal(false)}
            onSave={handleSaveTour}
          />
        )}
      </div>
    </div>
  );
};

export default MyTours;
