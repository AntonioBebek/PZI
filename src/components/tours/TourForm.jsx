import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

const TourForm = ({ isOpen, tour, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    youtubeUrl: '',
    category: 'priroda',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || '',
        description: tour.description || '',
        imageUrl: tour.imageUrl || '',
        youtubeUrl: tour.youtubeUrl || '',
        category: tour.category || 'priroda',
        location: tour.location || ''
      });
    }
  }, [tour]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(formData);
      onClose();
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        youtubeUrl: '',
        category: 'priroda',
        location: ''
      });
    } catch (err) {
      setError('Greška pri čuvanju ture');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Camera className="h-6 w-6 text-blue-600" />
            <span>{tour ? 'Uredite turu' : 'Dodajte novu turu'}</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Naziv ture *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field"
                placeholder="npr. Kravice Waterfalls"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokacija *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="input-field"
                placeholder="npr. Ljubuški"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorija *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input-field"
              >
                <option value="priroda">🌿 Priroda</option>
                <option value="kulturno">🏛️ Kulturno nasljeđe</option>
                <option value="avantura">🏔️ Avantura</option>
                <option value="gastronomija">🍽️ Gastronomija</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opis *</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field resize-none"
              placeholder="Opišite što čini ovu turu posebnom..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL slike *</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="input-field"
              placeholder="https://example.com/slika.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL (opciono)</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
              className="input-field"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`btn-primary flex-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Čuvam...' : (tour ? 'Sačuvaj izmjene' : 'Dodaj turu')}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourForm;
