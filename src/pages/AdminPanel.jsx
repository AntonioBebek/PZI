import React, { useState, useEffect, useCallback } from 'react';
import { Users, MapPin, Star, Trash2, Shield, Eye, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toursService, userService } from '../services/firebaseServices';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalTours: 0,
    totalUsers: 0,
    totalReviews: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    try {
      console.log('🔄 Loading admin data...');
      
      const [toursData, usersData] = await Promise.all([
        toursService.getAllTours(),
        userService.getAllUsers()
      ]);

      setTours(toursData);
      setUsers(usersData);
      
      // Calculate stats
      const totalReviews = toursData.reduce((sum, tour) => sum + (tour.reviewCount || 0), 0);
      const averageRating = toursData.reduce((sum, tour) => sum + (tour.rating || 0), 0) / toursData.length || 0;
      
      setStats({
        totalTours: toursData.length,
        totalUsers: usersData.length,
        totalReviews: totalReviews,
        averageRating: averageRating.toFixed(1)
      });
      
      console.log('✅ Admin data loaded');
    } catch (error) {
      console.error('❌ Load admin data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin()) {
      loadAdminData();
    }
  }, [user, isAdmin, loadAdminData]);

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovu turu?')) {
      try {
        await toursService.deleteTour(tourId);
        loadAdminData();
        alert('Tura je obrisana!');
      } catch (error) {
        console.error('❌ Delete tour error:', error);
        alert('Greška pri brisanju ture');
      }
    }
  };

  const makeAdmin = async (userId, userEmail) => {
    if (window.confirm(`Napraviti ${userEmail} adminom?`)) {
      try {
        await userService.updateUserProfile(userId, { role: 'admin' });
        loadAdminData();
        alert(`${userEmail} je sada admin!`);
      } catch (error) {
        console.error('❌ Make admin error:', error);
        alert('Greška pri dodavanju admin rola');
      }
    }
  };

  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pristup odbjen</h2>
          <p className="text-gray-600">Nemate admin dozvole za pristup ovoj stranici.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-yellow-400" />
            Admin Panel
          </h1>
          <p className="text-white/70">Upravljanje turama, korisnicima i recenzijama</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalTours}</div>
            <div className="text-sm text-gray-600">Ukupno tura</div>
          </div>

          <div className="card text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Registrovanih korisnika</div>
          </div>

          <div className="card text-center">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalReviews}</div>
            <div className="text-sm text-gray-600">Ukupno recenzija</div>
          </div>

          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Prosjek ocjena</div>
          </div>
        </div>

        {/* Users Management */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upravljanje korisnicima ({users.length})</h2>
          
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nema korisnika u bazi podataka</p>
              <p className="text-sm text-gray-500 mt-2">Korisnici se trebaju registrirati i spremiti u 'users' kolekciju</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rola</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Registriran</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData, index) => (
                    <tr key={userData.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 px-4 text-sm">{userData.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          userData.role === 'admin' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userData.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {new Date(userData.createdAt || Date.now()).toLocaleDateString('bs-BA')}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {userData.role !== 'admin' && (
                          <button
                            onClick={() => makeAdmin(userData.uid, userData.email)}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          >
                            Napravi admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tours Management */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upravljanje turama</h2>
            <span className="text-gray-600">{tours.length} tura</span>
          </div>

          {tours.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nema tura za upravljanje</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tura</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Korisnik</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategorija</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ocjena</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Pregledi</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((tour, index) => (
                    <tr key={tour.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {tour.imageUrl ? (
  <img
    src={tour.imageUrl}
    alt={tour.title}
    className="w-12 h-12 rounded-lg object-cover"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
) : null}
<div 
  className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
  style={{ display: tour.imageUrl ? 'none' : 'flex' }}
>
  📷
</div>

                          <div>
                            <div className="font-semibold text-gray-800">{tour.title}</div>
                            <div className="text-sm text-gray-600">{tour.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {tour.createdByEmail || 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {tour.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {tour.rating || 0} ({tour.reviewCount || 0})
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {tour.visitors || 0}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            title="Obriši turu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-8 card bg-yellow-50">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">🐛 Debug Info</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Trenutni korisnik:</strong> {user?.email || 'Nema'}</p>
            <p><strong>Je admin:</strong> {isAdmin() ? 'Da' : 'Ne'}</p>
            <p><strong>Korisnika u bazi:</strong> {users.length}</p>
            <p><strong>Tura u bazi:</strong> {tours.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
