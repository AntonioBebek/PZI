import React from 'react';
import { Plus, User, MapPin, Users, Star, Heart } from 'lucide-react';

const HeroSection = ({ onOpenAuth, onOpenTourForm, user }) => {
  return (
    <div className="relative py-20 px-4 bg-hero-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-orange-500/20"></div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Otkrijte čari{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Hercegovine
          </span>
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
          Pridružite se zajednici putnika i podijelite najljepša mjesta naše prekrasne Hercegovine
        </p>
        
        {!user ? (
          <button 
            onClick={onOpenAuth}
            className="btn-primary text-lg px-8 py-4 animate-pulse-slow hover:scale-110 transform transition-all duration-300"
          >
            <User className="inline-block h-5 w-5 mr-2" />
            Počnite putovanje
          </button>
        ) : (
          <button 
            onClick={onOpenTourForm}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto animate-pulse-slow hover:scale-110 transform transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>Dodajte novu turu</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
