import React from 'react';
import { MapPin, Star, Users, Calendar, Eye, Edit, Trash2, Youtube, User } from 'lucide-react';

const TourCard = ({ tour, onEdit, onDelete, canEdit, onViewDetails }) => {
  const getCategoryInfo = (category) => {
    const categories = {
      priroda: { color: 'bg-green-100 text-green-800', icon: '🌿' },
      kulturno: { color: 'bg-purple-100 text-purple-800', icon: '🏛️' },
      avantura: { color: 'bg-orange-100 text-orange-800', icon: '🏔️' },
      gastronomija: { color: 'bg-yellow-100 text-yellow-800', icon: '🍽️' }
    };
    return categories[category] || { color: 'bg-gray-100 text-gray-800', icon: '📍' };
  };

  const categoryInfo = getCategoryInfo(tour.category);

  return (
    <div className="card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={tour.imageUrl} 
          alt={tour.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.color} backdrop-blur-sm`}>
            {categoryInfo.icon} {tour.category}
          </span>
        </div>
        {tour.featured && (
          <div className="absolute top-2 left-2">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>Istaknuto</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {tour.title}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500 flex-shrink-0 ml-2">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{tour.rating || 0}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{tour.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{tour.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{tour.visitors || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(tour.createdAt || Date.now()).toLocaleDateString('bs-BA')}</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button 
            onClick={() => onViewDetails(tour)}
            className="btn-secondary flex-1 flex items-center justify-center space-x-1 text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>Detalji</span>
          </button>
          
          {tour.youtubeUrl && (
            <button 
              onClick={() => window.open(tour.youtubeUrl, '_blank')}
              className="btn-secondary flex items-center justify-center space-x-1 px-3 text-red-600 hover:text-red-700"
              title="Pogledaj video"
            >
              <Youtube className="h-4 w-4" />
            </button>
          )}

          {canEdit && (
            <>
              <button 
                onClick={() => onEdit(tour)}
                className="btn-secondary flex items-center justify-center space-x-1 px-3 text-blue-600 hover:text-blue-700"
                title="Uredi"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Jeste li sigurni da želite obrisati ovu turu?')) {
                    onDelete(tour.id);
                  }
                }}
                className="btn-secondary flex items-center justify-center space-x-1 px-3 text-red-600 hover:text-red-700"
                title="Obriši"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCard;
