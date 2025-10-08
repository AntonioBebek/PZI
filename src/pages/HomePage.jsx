import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toursService } from '../services/firebaseServices';
import HeroSection from '../components/sections/HeroSection';
import SearchAndFilters from '../components/tours/SearchAndFilters';
import TourCard from '../components/tours/TourCard';
import TourForm from '../components/tours/TourForm';
import TourDetailsModal from '../components/tours/TourDetailsModal';

const HomePage = () => {
  const { user, isAdmin } = useAuth();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showTourDetails, setShowTourDetails] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('svi');

  // Load tours on mount and when user changes
  useEffect(() => {
    loadTours();
  }, [user]);

  // Filter tours
  useEffect(() => {
    let filtered = [...tours];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(tour => 
        tour.title?.toLowerCase().includes(search) ||
        tour.location?.toLowerCase().includes(search) ||
        tour.description?.toLowerCase().includes(search)
      );
    }
    
    if (categoryFilter !== 'svi') {
      filtered = filtered.filter(tour => tour.category === categoryFilter);
    }
    
    // Sort by featured first, then by creation date
    filtered = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    
    setFilteredTours(filtered);
  }, [tours, searchTerm, categoryFilter]);

  const loadTours = async () => {
    try {
      setError('');
      console.log('🔄 Loading tours...');
      const toursData = await toursService.getAllTours();
      console.log('✅ Tours loaded:', toursData.length);
      setTours(toursData);
    } catch (err) {
      setError('Greška pri učitavanju tura');
      console.error('❌ Error loading tours:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshTours = async () => {
    setRefreshing(true);
    await loadTours();
  };

  const handleSaveTour = async (formData) => {
    try {
      console.log('💾 Saving tour:', formData);
      
      if (editingTour) {
        await toursService.updateTour(editingTour.id, formData);
        console.log('✅ Tour updated');
      } else {
        const tourId = await toursService.createTour(formData);
        console.log('✅ Tour created with ID:', tourId);
      }
      
      // Force refresh tours
      await loadTours();
      setShowTourForm(false);
      setEditingTour(null);
      
      alert(editingTour ? 'Tura je uspješno ažurirana!' : 'Tura je uspješno dodana!');
    } catch (err) {
      console.error('❌ Error saving tour:', err);
      alert('Greška pri spremanju ture: ' + err.message);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu turu?')) {
      return;
    }
    
    try {
      await toursService.deleteTour(tourId);
      await loadTours();
      alert('Tura je uspješno obrisana!');
    } catch (err) {
      console.error('❌ Error deleting tour:', err);
      alert('Greška pri brisanju ture: ' + err.message);
    }
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setShowTourForm(true);
  };

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    setShowTourDetails(true);
    toursService.incrementVisitors(tour.id).catch(console.error);
  };

  const canEditTour = (tour) => {
    return user && (isAdmin() || tour.createdBy === user.uid);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam ture...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <HeroSection 
        onOpenTourForm={() => setShowTourForm(true)}
        user={user}
      />

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        toursCount={tours.length}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {error ? (
          <div className="flex justify-center items-center py-20">
            <div className="card text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Greška</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <button onClick={loadTours} className="btn-primary w-full">
                  Pokušaj ponovno
                </button>
                <button onClick={() => window.location.reload()} className="btn-secondary w-full">
                  Osvježi stranicu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                {searchTerm ? `Rezultati pretrage: "${searchTerm}"` : 
                 categoryFilter === 'svi' ? 'Sve ture' : `Kategorija: ${categoryFilter}`}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-white/70 text-lg">
                  {filteredTours.length} {filteredTours.length === 1 ? 'tura' : 'tura'}
                </span>
                <button 
                  onClick={refreshTours}
                  disabled={refreshing}
                  className="text-white/70 hover:text-white text-sm flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Osvježi</span>
                </button>
              </div>
            </div>
            
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTours.map((tour, index) => (
                  <div
                    key={tour.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TourCard
                      tour={tour}
                      onEdit={handleEditTour}
                      onDelete={handleDeleteTour}
                      onViewDetails={handleViewDetails}
                      canEdit={canEditTour(tour)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="card inline-block max-w-md">
                  <div className="text-6xl mb-6">🏔️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {searchTerm || categoryFilter !== 'svi' ? 'Nema rezultata' : 'Nema dodanih tura'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || categoryFilter !== 'svi' 
                      ? 'Pokušajte sa drugačijim pojmom pretrage ili filtrom'
                      : 'Registrirajte se i dodajte prvu turu!'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {(searchTerm || categoryFilter !== 'svi') && (
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setCategoryFilter('svi');
                        }}
                        className="btn-secondary"
                      >
                        Poništi filtere
                      </button>
                    )}
                    {user && (
                      <button 
                        onClick={() => setShowTourForm(true)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Dodaj turu</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      {user && !showTourForm && (
        <button
          onClick={() => setShowTourForm(true)}
          className="fixed bottom-6 right-6 btn-primary rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 hover:scale-110"
          title="Dodaj novu turu"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Guest notification */}
      {!user && (
        <div className="fixed bottom-6 left-6 card max-w-sm animate-slide-up z-40">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Dobrodošli, gostu!</h4>
              <p className="text-sm text-gray-600 mb-3">
                Registrirajte se da biste mogli dodavati i uređivati ture.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TourForm
        isOpen={showTourForm}
        tour={editingTour}
        onClose={() => {
          setShowTourForm(false);
          setEditingTour(null);
        }}
        onSave={handleSaveTour}
      />

      <TourDetailsModal
        tour={selectedTour}
        isOpen={showTourDetails}
        onClose={() => {
          setShowTourDetails(false);
          setSelectedTour(null);
        }}
      />
    </div>
  );
};

export default HomePage;
