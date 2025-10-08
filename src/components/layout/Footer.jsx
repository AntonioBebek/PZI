import React from 'react';
import { MapPin, Heart, Users, Star } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Hercegovina Tours</h3>
                <p className="text-cyan-200 text-sm">Otkrijte čari Hercegovine</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Platforma za dijeljenje najljepših mjesta naše prekrasne Hercegovine. 
              Pridružite se zajednici putnika i istražite skrivene dragulije našeg kraja.
            </p>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Statistike</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white/70">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">Ture dodane</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Users className="h-4 w-4 text-green-400" />
                <span className="text-sm">Aktivni korisnici</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Prosječna ocjena</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Kategorije</h4>
            <div className="space-y-2">
              <div className="text-white/70 text-sm flex items-center">
                <span className="mr-2">🌿</span> Priroda
              </div>
              <div className="text-white/70 text-sm flex items-center">
                <span className="mr-2">🏛️</span> Kulturno nasljeđe
              </div>
              <div className="text-white/70 text-sm flex items-center">
                <span className="mr-2">🏔️</span> Avantura
              </div>
              <div className="text-white/70 text-sm flex items-center">
                <span className="mr-2">🍽️</span> Gastronomija
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-white/60 text-sm text-center md:text-left">
              <p>© {currentYear} Hercegovina Tours. Napravljeno s ❤️ za Hercegovinu.</p>
            </div>

            {/* Made with love indicator */}
            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>Fakultetski projekt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50"></div>
    </footer>
  );
};

export default Footer;
