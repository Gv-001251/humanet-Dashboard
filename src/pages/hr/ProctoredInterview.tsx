import React, { useRef, useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { Camera, Upload, XCircle, CheckCircle, Video, UserCheck, Users, Calendar, Clock, MapPin } from 'lucide-react';
import { ResumeService, Candidate } from '../../services/api/resumeService';

// For real face matching, you can integrate face-api.js here - for hackathon, we'll simulate

interface InterviewSession {
  id: string;
  candidate: Candidate;
  scheduledDate: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  proctoringEnabled: boolean;
  verificationResult?: 'pending' | 'match' | 'no-match';
}

export default function ProctoredInterview() {
  const { darkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<'pending' | 'match' | 'no-match' | null>(null);
  const [streamStarted, setStreamStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interview management state
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: '',
    duration: 60,
    proctoringEnabled: true,
  });

  // Load candidates and interviews
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const candidatesData = await ResumeService.getAllCandidates();
      setCandidates(candidatesData);
      
      // Generate sample interviews from candidates
      const sampleInterviews: InterviewSession[] = candidatesData.slice(0, 5).map((candidate, index) => ({
        id: `interview-${index + 1}`,
        candidate,
        scheduledDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        status: index === 0 ? 'in-progress' : index < 2 ? 'scheduled' : 'completed',
        proctoringEnabled: true,
        verificationResult: index === 0 ? 'match' : undefined,
      }));
      setInterviews(sampleInterviews);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleInterview = () => {
    if (!selectedCandidate || !scheduleForm.scheduledDate) return;
    
    const candidate = candidates.find(c => c._id === selectedCandidate);
    if (!candidate) return;

    const newInterview: InterviewSession = {
      id: `interview-${Date.now()}`,
      candidate,
      scheduledDate: scheduleForm.scheduledDate,
      duration: scheduleForm.duration,
      status: 'scheduled',
      proctoringEnabled: scheduleForm.proctoringEnabled,
    };

    setInterviews(prev => [...prev, newInterview]);
    setShowScheduleModal(false);
    setSelectedCandidate('');
    setScheduleForm({
      scheduledDate: '',
      duration: 60,
      proctoringEnabled: true,
    });
  };

  const updateInterviewStatus = (interviewId: string, status: InterviewSession['status']) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === interviewId 
          ? { ...interview, status }
          : interview
      )
    );
  };
  
  // Start webcam stream
  const startWebcam = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreamStarted(true);
    } catch (err) {
      alert('Could not access webcam');
    }
  };

  // Stop webcam stream
  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStreamStarted(false);
  };

  // Capture selfie from video stream
  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setSelfie(dataUrl);
    // Stop webcam after capture
    stopWebcam();
    setVerificationResult('pending');
    // Simulate face match after 2 seconds
    setTimeout(() => {
      // For hackathon demo, 80% chance of match
      const isMatch = Math.random() < 0.8;
      setVerificationResult(isMatch ? 'match' : 'no-match');
    }, 2000);
  };

  // Handle ID photo upload
  const handleIdPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setIdPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Proctored Video Interview System
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>
              Schedule and conduct proctored interviews with AI-powered identity verification
            </p>
          </div>

          {/* Interview Management Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Scheduled Interviews */}
            <div className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Interview Sessions
                </h2>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Schedule Interview
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviews.slice(0, 5).map(interview => (
                    <div key={interview.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {interview.candidate.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                          interview.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          interview.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {interview.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(interview.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {interview.duration} min
                        </div>
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-1" />
                          {interview.proctoringEnabled ? 'Proctored' : 'Regular'}
                        </div>
                      </div>
                      {interview.status === 'scheduled' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => updateInterviewStatus(interview.id, 'in-progress')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updateInterviewStatus(interview.id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Interview Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {interviews.length}
                      </p>
                      <p className="text-sm text-gray-600">Total Interviews</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {interviews.filter(i => i.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {interviews.filter(i => i.status === 'scheduled').length}
                      </p>
                      <p className="text-sm text-gray-600">Scheduled</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <Video className="w-8 h-8 text-purple-600" />
                    <div className="ml-3">
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {interviews.filter(i => i.status === 'in-progress').length}
                      </p>
                      <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Verification Section */}
          <div className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Identity Verification for Current Interview
            </h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload your official ID, then capture a live selfie to verify your identity before interview.
            </p>

          {/* Step 1: Upload ID photo */}
          <div className={`mt-8 p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              1. Upload ID Photo
            </h2>
            <label
              htmlFor="id-photo-upload"
              className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-gray-400 px-6 py-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                {idPhoto ? "Change ID Photo" : "Click to Upload or Drag & Drop"}
              </span>
              <input
                type="file"
                accept="image/*"
                id="id-photo-upload"
                onChange={handleIdPhotoUpload}
                className="hidden"
              />
            </label>
            {idPhoto && (
              <div className="mt-6">
                <img src={idPhoto} alt="Uploaded ID" className="max-w-xs rounded-lg shadow-md" />
              </div>
            )}
          </div>

          {/* Step 2: Capture Live Selfie */}
          <div className={`mt-8 p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              2. Capture Live Selfie
            </h2>

            {!selfie ? (
              <>
                {!streamStarted ? (
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={startWebcam}
                    disabled={!idPhoto}
                    title={!idPhoto ? "Upload your ID first" : ""}
                  >
                    Start Webcam
                  </button>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="rounded-lg max-w-xs mx-auto mb-4"
                      autoPlay
                      muted
                      playsInline
                    />
                    <div className="flex justify-center gap-4">
                      <button
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        onClick={stopWebcam}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        onClick={captureSelfie}
                      >
                        Capture Photo
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center mb-4">
                <img src={selfie} alt="Captured Selfie" className="max-w-xs rounded-lg shadow-md mx-auto mb-4" />
                <div>
                  {verificationResult === 'pending' && (
                    <p className="text-yellow-400 font-medium">Verifying face, please wait...</p>
                  )}
                  {verificationResult === 'match' && (
                    <p className="text-green-500 font-semibold flex items-center justify-center gap-2">
                      <CheckCircle /> Face Matched Successfully!
                    </p>
                  )}
                  {verificationResult === 'no-match' && (
                    <p className="text-red-500 font-semibold flex items-center justify-center gap-2">
                      <XCircle /> Face Did Not Match. Please Retry.
                    </p>
                  )}
                </div>
                <button
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    setSelfie(null);
                    setVerificationResult(null);
                    startWebcam();
                  }}
                >
                  Retake Selfie
                </button>
              </div>
            )}
          </div>

          {/* Video Interview Placeholder */}
          <div className={`mt-8 p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              3. Interview Video Call
            </h2>
            <div className="rounded-lg border-2 border-gray-400 flex items-center justify-center h-64 text-gray-400">
              <Video className="w-16 h-16 mr-4" />
              <span>Video interview call placeholder (Integrate with Jitsi / Daily / Twilio)</span>
            </div>
          </div>

          {/* Canvas for capture */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Schedule New Interview</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Candidate
                  </label>
                  <select
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a candidate</option>
                    {candidates.map(candidate => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.name} - {candidate.experience_years} years exp
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    max="180"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="proctoring"
                    checked={scheduleForm.proctoringEnabled}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, proctoringEnabled: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="proctoring" className="text-sm text-gray-700">
                    Enable proctoring (AI identity verification)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedCandidate('');
                    setScheduleForm({
                      scheduledDate: '',
                      duration: 60,
                      proctoringEnabled: true,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleInterview}
                  disabled={!selectedCandidate || !scheduleForm.scheduledDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

