import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  AlertCircle,
  Camera,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Navigation,
  ThumbsUp,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { Category } from '../types';
import { CivicMap } from '../components/CivicMap';
import { useAuth } from '../contexts/AuthContext';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast, user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<number>(6);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

  // Location state (Defaulting to central Bengaluru)
  const [locationAddress, setLocationAddress] = useState('100 Feet Rd, Indiranagar, Bengaluru');
  const [locality, setLocality] = useState('Indiranagar');
  const [ward, setWard] = useState('Ward 80');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.9784,
    lng: 77.6408
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  // Duplicate Check State
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<any>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const list = await api.getCategories();
    setCategories(list);
    if (!categoryId && list.length > 0) {
      setCategoryId(list[0].id);
    }
  };

  // Preset sample images for quick demonstration
  const sampleImages = [
    { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', catSlug: 'potholes' },
    { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80', catSlug: 'garbage' },
    { label: 'Broken Streetlight', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80', catSlug: 'streetlight' },
    { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80', catSlug: 'water-leakage' }
  ];

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        runAiClassification(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleImage = (item: (typeof sampleImages)[0]) => {
    setImagePreview(item.url);
    runAiClassification(item.label);
  };

  // Run AI Assistant
  const runAiClassification = async (fileName: string) => {
    try {
      const res = await api.suggestAiCategory({ fileName, imageUrl: imagePreview || '' });
      if (res && res.suggestedCategory) {
        setAiSuggestion(res);
        setCategoryId(res.suggestedCategory.id);
        if (res.suggestedCategory.defaultSeverity) {
          setSeverity(res.suggestedCategory.defaultSeverity);
        }
        showToast(`AI Assistant suggested category: ${res.suggestedCategory.name}`, 'info');
      }
    } catch (e) {
      // Graceful fallback
    }
  };

  // Capture GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationAddress(`Near Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}, Bengaluru`);
        setGpsLoading(false);
        showToast('Current GPS coordinates captured with high accuracy.', 'success');
      },
      (err) => {
        setGpsLoading(false);
        showToast('GPS permission denied or unavailable. Please pick location manually on map.', 'warning');
      },
      { timeout: 10000 }
    );
  };

  // Move from Step 3 to Step 4 (Run Duplicate Check)
  const proceedToReview = async () => {
    setLoading(true);
    try {
      const dupRes = await api.checkDuplicates({
        title,
        description,
        categoryId,
        latitude: coords.lat,
        longitude: coords.lng
      });
      setDuplicateCheckResult(dupRes);
      setStep(4);
    } catch (e) {
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  // Final Submit
  const handleSubmitComplaint = async () => {
    setLoading(true);
    try {
      const created = await api.createComplaint({
        title,
        description,
        categoryId,
        severity,
        locationAddress,
        locality,
        ward,
        latitude: coords.lat,
        longitude: coords.lng,
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
      });
      setSubmittedId(created.id);
      showToast(`Grievance ${created.complaint_number} submitted successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Submission failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  // Success Confirmation Screen
  if (submittedId) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary-900">
              Grievance Registered Successfully
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your report has been logged and forwarded to the responsible division.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Complaint Reference:</span>
              <span className="font-mono font-bold text-primary-600 text-sm">
                CC-2026-{(Math.floor(Math.random() * 900) + 100).toString().padStart(6, '0')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-900">{selectedCategoryObj?.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Target Locality:</span>
              <span className="font-semibold text-slate-900">{locality} ({ward})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Resolution SLA:</span>
              <span className="font-semibold text-slate-900">Within {selectedCategoryObj?.resolutionDeadlineHours || 48} Hours</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/complaints/${submittedId}`}
              className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Track Status & Live Timeline
            </Link>
            <button
              onClick={() => {
                setSubmittedId(null);
                setStep(1);
                setTitle('');
                setDescription('');
                setImagePreview(null);
              }}
              className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Civic Submission Wizard</span>
          <h1 className="text-3xl font-extrabold font-heading text-secondary-900 mt-1">
            Report a Civic Grievance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Follow the 4 steps below to report road damage, garbage, water leaks, or streetlight failures.
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-8 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Issue Details' },
              { num: 2, label: 'Photo Evidence' },
              { num: 3, label: 'Pin Location' },
              { num: 4, label: 'Review & Duplicates' }
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all ${
                  step === s.num
                    ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200 shadow-sm'
                    : step > s.num
                    ? 'text-emerald-600 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      step === s.num
                        ? 'bg-primary-600 text-white'
                        : step > s.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* STEP 1: ISSUE DETAILS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Deep crater pothole outside 12th Main cross junction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Civic Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (SLA: {c.resolutionDeadlineHours}h)
                    </option>
                  ))}
                </select>
                {selectedCategoryObj && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    {selectedCategoryObj.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide specific details: size of defect, danger to traffic, duration observed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Observed Severity: <span className="text-primary-600 font-extrabold">{severity} / 10</span>
                  </label>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {severity >= 8 ? 'Critical Hazard' : severity >= 6 ? 'High Priority' : 'Moderate'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Minor Inconvenience)</span>
                  <span>5 (Noticeable Defect)</span>
                  <span>10 (Immediate Life Safety Hazard)</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!title.trim() || !description.trim()}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <span>Continue to Photo Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTOGRAPHIC EVIDENCE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Upload Photographic Proof *
                </label>
                <p className="text-xs text-slate-500 mb-4">
                  Visual proof allows field engineers to deploy correct tools and materials.
                </p>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 aspect-video max-h-72 bg-slate-100">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setAiSuggestion(null);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                      aria-label="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-primary-600 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      Click to upload or drag & drop image
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG, or WEBP (Max file size: 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Sample demonstration presets */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Or select a demonstration photo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleImage(s)}
                      className="text-left p-2 rounded-xl border border-slate-200 hover:border-primary-500 hover:bg-blue-50/40 text-xs transition-all flex flex-col gap-1.5"
                    >
                      <img src={s.url} alt={s.label} className="w-full h-16 object-cover rounded-lg" />
                      <span className="font-semibold text-slate-800 truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Classification Suggestion Alert */}
              {aiSuggestion && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-purple-900">
                      AI Classifier Detected: {aiSuggestion.suggestedCategory.name} (Confidence: {Math.round(aiSuggestion.confidenceScore * 100)}%)
                    </p>
                    <p className="text-purple-700">
                      {aiSuggestion.disclaimer} You can change the category at any time.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow flex items-center gap-2 transition-colors"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PIN LOCATION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Interactive Incident Location Map
                  </label>
                  <p className="text-xs text-slate-500">
                    Click anywhere on the map or drag the pin to set exact coordinates.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={gpsLoading}
                  onClick={handleDetectLocation}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-primary-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-200 self-start sm:self-auto transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{gpsLoading ? 'Detecting GPS...' : 'Use Current GPS'}</span>
                </button>
              </div>

              {/* Map */}
              <CivicMap
                interactiveSelect={true}
                selectedLocation={coords}
                onLocationSelect={(lat, lng) => setCoords({ lat, lng })}
                height="320px"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Locality (Bengaluru Area) *
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                  >
                    {['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'HSR Layout', 'MG Road', 'Rajajinagar', 'Electronic City', 'Hebbal', 'Bellandur', 'Marathahalli'].map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Selected Coordinates:</span>
                <span className="font-mono font-bold text-slate-800">
                  {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={proceedToReview}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow flex items-center gap-2 transition-colors"
                >
                  <span>{loading ? 'Checking Duplicates...' : 'Review & Duplicate Check'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & DUPLICATE DETECTION */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Duplicate Detection Alert Box */}
              {duplicateCheckResult?.hasDuplicates ? (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2.5 text-amber-900 font-heading font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>
                      Potential Duplicate Found Within 50 Metres ({duplicateCheckResult.count} nearby active issue)
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Our smart geospatial detector identified an active unresolved complaint near your coordinates. You can upvote the existing issue to boost its priority score, or proceed if yours is a distinct defect.
                  </p>

                  <div className="space-y-2 pt-1">
                    {duplicateCheckResult.duplicates.map((dup: any) => (
                      <div
                        key={dup.id}
                        className="bg-white p-3 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {dup.complaintNumber} — {dup.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Distance: {dup.distanceMeters}m away • {dup.locality} • Status: {dup.status}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            api.toggleVote(dup.id);
                            showToast(`Upvoted existing complaint ${dup.complaintNumber}! Priority score increased.`, 'success');
                            navigate('/explore');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Upvote Instead</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No existing duplicates detected in a 50m radius. Ready for fresh registration!</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-sm text-slate-900 font-heading border-b border-slate-200 pb-2">
                  Complaint Registration Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Title:</span>
                    <span className="font-semibold text-slate-900">{title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <span className="font-semibold text-slate-900">{selectedCategoryObj?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Severity:</span>
                    <span className="font-semibold text-slate-900">{severity} / 10</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location:</span>
                    <span className="font-semibold text-slate-900">{locationAddress} ({locality})</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block">Description:</span>
                  <p className="text-slate-700 leading-relaxed mt-0.5">{description}</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Map</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmitComplaint}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Confirm & Submit Grievance'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
