import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { FileText, User, AlertTriangle, CheckCircle, Clock, Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { OfferService, Offer, CreateOfferRequest } from '../../services/api/offerService';
import { ResumeService, Candidate } from '../../services/api/resumeService';

export default function OfferManagement() {
  const { darkMode } = useTheme();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showOfferDetails, setShowOfferDetails] = useState(false);

  // Create offer form state
  const [createForm, setCreateForm] = useState<CreateOfferRequest>({
    candidate_id: '',
    candidate_name: '',
    candidate_email: '',
    position: '',
    department: '',
    offered_ctc: 0,
    current_ctc: 0,
    joining_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [offersData, candidatesData] = await Promise.all([
        OfferService.getAllOffers(),
        ResumeService.getAllCandidates(),
      ]);
      setOffers(offersData);
      setCandidates(candidatesData);
      setError(null);
    } catch (err) {
      setError('Failed to load offers data');
      console.error('Error loading offers data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async () => {
    try {
      if (!createForm.candidate_id || !createForm.position || !createForm.department) {
        setError('Please fill in all required fields');
        return;
      }

      const selectedCandidate = candidates.find(c => c._id === createForm.candidate_id);
      if (!selectedCandidate) {
        setError('Selected candidate not found');
        return;
      }

      const offerData: CreateOfferRequest = {
        ...createForm,
        candidate_name: selectedCandidate.name,
        candidate_email: selectedCandidate.email,
        current_ctc: selectedCandidate.current_ctc,
      };

      const newOffer = await OfferService.createOffer(offerData);
      setOffers(prev => [newOffer, ...prev]);
      
      // Reset form
      setCreateForm({
        candidate_id: '',
        candidate_name: '',
        candidate_email: '',
        position: '',
        department: '',
        offered_ctc: 0,
        current_ctc: 0,
        joining_date: new Date().toISOString().split('T')[0],
      });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
      console.error('Error creating offer:', err);
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, status: 'pending' | 'accepted' | 'rejected' | 'withdrawn') => {
    try {
      await OfferService.updateOfferStatus(offerId, { status });
      setOffers(prev => 
        prev.map(offer => 
          offer._id === offerId 
            ? { ...offer, status, response_date: new Date() }
            : offer
        )
      );
    } catch (err) {
      setError('Failed to update offer status');
      console.error('Error updating offer status:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCandidateSelect = (candidateId: string) => {
    const candidate = candidates.find(c => c._id === candidateId);
    if (candidate) {
      setCreateForm(prev => ({
        ...prev,
        candidate_id: candidateId,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        current_ctc: candidate.current_ctc,
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'withdrawn':
        return <Clock className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return OfferService.formatCurrency(amount);
  };

  const formatDate = (date: Date | string) => {
    return OfferService.formatDate(date);
  };

  const getRiskColor = (riskLevel: string) => {
    return OfferService.getRiskColor(riskLevel);
  };

  const calculateHikePercentage = (currentCtc: number, offeredCtc: number) => {
    return OfferService.calculateHikePercentage(currentCtc, offeredCtc);
  };

  const getShoppingRiskLevel = (offer: Offer) => {
    const risk = OfferService.calculateShoppingRisk(offer);
    return risk.shopping_risk ? 'High' : 'Low';
  };

  const getShoppingRiskColor = (offer: Offer) => {
    const risk = OfferService.calculateShoppingRisk(offer);
    return risk.shopping_risk ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
  };

  const getOfferStats = () => {
    const total = offers.length;
    const pending = offers.filter(o => o.status === 'pending').length;
    const accepted = offers.filter(o => o.status === 'accepted').length;
    const rejected = offers.filter(o => o.status === 'rejected').length;
    const highRisk = offers.filter(o => getShoppingRiskLevel(o) === 'High').length;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    const avgHike = total > 0 ? offers.reduce((sum, o) => sum + o.hike_percentage, 0) / total : 0;

    return { total, pending, accepted, rejected, highRisk, acceptanceRate, avgHike };
  };

  const stats = getOfferStats();

  if (loading) {
    return (
      <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="pt-20 px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Offer Management & Shopping Detection
          </h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Manage job offers and detect candidate shopping behavior
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Offer
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border border-gray-200`}>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border border-gray-200`}>
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border border-gray-200`}>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.acceptanceRate}%</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border border-gray-200`}>
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.highRisk}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className={`rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border border-gray-200`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Recent Offers Made ({offers.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  High Risk: {stats.highRisk}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Avg Hike: {stats.avgHike.toFixed(1)}%
                </span>
              </div>
            </div>

            {offers.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-500">No offers found</p>
                <p className="text-sm text-gray-400 mt-2">Create your first offer to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
              {offers.map(offer => (
                  <div
                    key={offer._id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                      getShoppingRiskLevel(offer) === 'High'
                        ? "border-red-200 ring-2 ring-red-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(offer.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{offer.candidate_name}</span>
                        {getShoppingRiskLevel(offer) === 'High' && (
                          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            <ShoppingCart className="w-3 h-3" />
                            Shopping Risk
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(offer.status)}`}>
                          {OfferService.getStatusText(offer.status)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4">
                          <span><strong>Role:</strong> {offer.position} - {offer.department}</span>
                          <span><strong>Joining:</strong> {formatDate(offer.joining_date)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span><strong>Current CTC:</strong> {formatCurrency(offer.current_ctc)}</span>
                          <span><strong>Offered CTC:</strong> {formatCurrency(offer.offered_ctc)}</span>
                          <span className="flex items-center gap-1">
                            <strong>Hike:</strong>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              offer.hike_percentage > 40 ? 'text-red-600 bg-red-100' :
                              offer.hike_percentage > 25 ? 'text-yellow-600 bg-yellow-100' :
                              'text-green-600 bg-green-100'
                            }`}>
                              {offer.hike_percentage.toFixed(1)}%
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      {offer.risk_assessment && offer.risk_assessment.shopping_risk && (
                        <div className="mt-2">
                          <p className="text-xs text-red-600 font-medium">Risk Factors:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {offer.risk_assessment.risk_factors.map((factor, index) => (
                              <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                {factor}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-red-600 mt-1">
                            <strong>Recommendation:</strong> {offer.risk_assessment.recommendation}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end text-xs text-gray-500 gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Sent: {formatDate(offer.sent_date || offer.created_at || '')}
                      </span>
                      {offer.response_date && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Response: {formatDate(offer.response_date)}
                        </span>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setShowOfferDetails(true);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {offer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateOfferStatus(offer._id!, 'accepted')}
                              className="p-1 text-green-400 hover:text-green-600"
                              title="Mark as Accepted"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateOfferStatus(offer._id!, 'rejected')}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Mark as Rejected"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Offer Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Create New Offer
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Candidate *
                  </label>
                  <select
                    value={createForm.candidate_id}
                    onChange={(e) => handleCandidateSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a candidate...</option>
                    {candidates.map(candidate => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.name} ({candidate.email}) - {formatCurrency(candidate.expected_ctc)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={createForm.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={createForm.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offered CTC (₹)
                    </label>
                    <input
                      type="number"
                      name="offered_ctc"
                      value={createForm.offered_ctc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter offered CTC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      name="joining_date"
                      value={createForm.joining_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {createForm.candidate_id && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Candidate Information</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Name:</strong> {createForm.candidate_name}</p>
                      <p><strong>Email:</strong> {createForm.candidate_email}</p>
                      <p><strong>Current CTC:</strong> {formatCurrency(createForm.current_ctc)}</p>
                      {createForm.offered_ctc > 0 && (
                        <p><strong>Hike Percentage:</strong> {calculateHikePercentage(createForm.current_ctc, createForm.offered_ctc).toFixed(1)}%</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOffer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}