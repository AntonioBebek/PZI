import React, { useState } from 'react';
import { MapPin, Star, Users, Calendar, Youtube, User, X } from 'lucide-react';
import AddReview from '../reviews/AddReview';
import ReviewsList from '../reviews/ReviewsList';

const TourDetailsModal = ({ tour, isOpen, onClose }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!isOpen || !tour) return null;

  const handleReviewAdded = () => {
    // Trigeriraj ponovno učitavanje recenzija
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{tour.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            {/* Postojeći kod za sliku */}
            {tour.imageUrl ? (
              <img 
                src={tour.imageUrl} 
                alt={tour.title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const fallbackImages = {
                    priroda: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                    kulturno: 'https://images.unsplash.com/photo-1520637736862-4d197d17c15a?w=800',
                    avantura: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
                    gastronomija: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
                  };
                  e.target.src = fallbackImages[tour.category] || fallbackImages.priroda;
                }}
              />
            ) : (
              <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🏔️</div>
                  <p>Nema slike</p>
                </div>
              </div>
            )}
            
            {tour.youtubeUrl && (
              <div className="mt-4">
                <button 
                  onClick={() => window.open(tour.youtubeUrl, '_blank')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Youtube className="h-5 w-5" />
                  <span>Pogledaj video</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Postojeći kod za opis i statistike */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Opis</h3>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Lokacija</div>
                    <div className="font-semibold">{tour.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-sm text-gray-600">Ocjena</div>
                    <div className="font-semibold">{tour.rating || '0.0'}/5.0</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Posjeta</div>
                    <div className="font-semibold">{tour.visitors || 0}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Dodano</div>
                    <div className="font-semibold">
                      {new Date(tour.createdAt || Date.now()).toLocaleDateString('bs-BA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Dodao/la</div>
                  <div className="text-sm text-gray-600">{tour.createdByEmail || 'Nepoznato'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NOVA SEKCIJA: Recenzije */}
        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dodaj recenziju */}
            <div>
              <AddReview 
                tourId={tour.id} 
                onReviewAdded={handleReviewAdded}
              />
            </div>
            
            {/* Prikaz recenzija */}
            <div>
              <ReviewsList 
                tourId={tour.id}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsModal;
