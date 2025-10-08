import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, FileText, Youtube, Star } from 'lucide-react';

const TourModal = ({ tour, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    youtubeUrl: '',
    rating: 5
  });

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name || '',
        location: tour.location || '',
        description: tour.description || '',
        imageUrl: tour.imageUrl || '',
        youtubeUrl: tour.youtubeUrl || '',
        rating: tour.rating || 5
      });
    }
  }, [tour]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {tour ? 'Uredi turu' : 'Dodaj novu turu'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Naziv ture */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Naziv ture
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Unesite naziv ture..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          {/* Lokacija */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Lokacija
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Unesite lokaciju..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          {/* Opis */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Opis
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Opišite turu..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
              required
            />
          </div>

          {/* URL slike */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Upload className="w-4 h-4 mr-2" />
              URL slike
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/slika.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* YouTube URL */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Youtube className="w-4 h-4 mr-2 text-red-500" />
              YouTube link (opcionalno)
            </label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Ocjena (1-5)
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            >
              <option value={1}>1 ⭐</option>
              <option value={2}>2 ⭐⭐</option>
              <option value={3}>3 ⭐⭐⭐</option>
              <option value={4}>4 ⭐⭐⭐⭐</option>
              <option value={5}>5 ⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          {/* Dugmad */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {tour ? 'Spremi promjene' : 'Dodaj turu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourModal;
