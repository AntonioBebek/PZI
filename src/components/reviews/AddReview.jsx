import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewsService } from '../../services/firebaseServices';

const AddReview = ({ tourId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Morate se prijaviti da ostavite recenziju!');
      return;
    }

    if (rating === 0) {
      setError('Molimo odaberite ocjenu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reviewsService.addReview(tourId, rating, comment);
      
      // Reset form
      setRating(0);
      setComment('');
      setHoveredRating(0);
      
      // Pozovi callback da se osvježe recenzije
      if (onReviewAdded) {
        onReviewAdded();
      }
      
      alert('✅ Recenzija je uspješno dodana!');
    } catch (error) {
      console.error('❌ Error adding review:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
    setError('');
  };

  if (!user) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 mb-4">Prijavite se da biste mogli ostaviti recenziju</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Ostavite recenziju</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ocjena *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Odabrali ste {rating} zvjezdica
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Komentar
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Opišite vaše iskustvo sa ovom turom..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 karaktera
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Spremam...' : 'Pošaljite recenziju'}
        </button>
      </form>
    </div>
  );
};

export default AddReview;
