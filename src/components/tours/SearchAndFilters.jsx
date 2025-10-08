import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchAndFilters = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, toursCount }) => {
  const categories = [
    { value: 'svi', label: 'Sve kategorije', count: toursCount },
    { value: 'priroda', label: 'Priroda', icon: '🌿' },
    { value: 'kulturno', label: 'Kulturno nasljeđe', icon: '🏛️' },
    { value: 'avantura', label: 'Avantura', icon: '🏔️' },
    { value: 'gastronomija', label: 'Gastronomija', icon: '🍽️' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Pretražite ture, lokacije, opise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field pl-10 pr-8 w-full appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon ? `${cat.icon} ${cat.label}` : cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Active filters display */}
        {(searchTerm || categoryFilter !== 'svi') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
            <span className="text-sm text-gray-600">Aktivni filteri:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Pretraga: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {categoryFilter !== 'svi' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Kategorija: {categories.find(c => c.value === categoryFilter)?.label}
                <button 
                  onClick={() => setCategoryFilter('svi')}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;
