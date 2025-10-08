import React, { useState, useEffect } from 'react';
import { Star, User, Calendar } from 'lucide-react';
import { reviewsService } from '../../services/firebaseServices';

const ReviewsList = ({ tourId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [tourId, refreshTrigger]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await reviewsService.getTourReviews(tourId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-4xl mb-4">💭</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Nema recenzija</h3>
        <p className="text-gray-600">Budite prvi koji će ostaviti recenziju za ovu turu!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Recenzije ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <div key={review.id} className="card">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {review.userEmail?.split('@')[0] || 'Anonimni korisnik'}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(review.createdAt).toLocaleDateString('bs-BA')}
                </div>
              </div>
              
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}
              
              {review.helpful > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  👍 {review.helpful} korisnika je označilo kao korisno
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
