import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Clock, MapPin, Users, Calendar, Check, X, Loader2, ChevronLeft } from 'lucide-react';
import type { 
  Experience, 
  BookingData, 
  BookingResult, 
  BookingFormData,
  PromoValidationResponse,
  DateAvailability,
  TimeSlot 
} from './types';

const API_BASE_URL = process.env.VITE_API_URL;;

type PageType = 'home' | 'details' | 'checkout' | 'result';

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const navigateToDetails = (experience: Experience) => {
    setSelectedExperience(experience);
    setCurrentPage('details');
  };

  const navigateToCheckout = (data: BookingData) => {
    setBookingData(data);
    setCurrentPage('checkout');
  };

  const navigateToResult = (result: BookingResult) => {
    setBookingResult(result);
    setCurrentPage('result');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedExperience(null);
    setBookingData(null);
    setBookingResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' && <HomePage onSelectExperience={navigateToDetails} />}
      {currentPage === 'details' && selectedExperience && (
        <DetailsPage 
          experience={selectedExperience} 
          onBack={navigateToHome}
          onProceed={navigateToCheckout}
        />
      )}
      {currentPage === 'checkout' && bookingData && (
        <CheckoutPage 
          bookingData={bookingData}
          onBack={() => setCurrentPage('details')}
          onComplete={navigateToResult}
        />
      )}
      {currentPage === 'result' && bookingResult && (
        <ResultPage 
          result={bookingResult}
          onGoHome={navigateToHome}
        />
      )}
    </div>
  );
}

// Home Page Component
interface HomePageProps {
  onSelectExperience: (experience: Experience) => void;
}

function HomePage({ onSelectExperience }: HomePageProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Experience[]>(`${API_BASE_URL}/experiences`);
      setExperiences(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load experiences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Experiences</h1>
        <p className="text-lg text-gray-600">Find and book amazing activities</p>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchExperiences}
            className="mt-2 text-red-600 font-medium hover:text-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Experience Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <ExperienceCard 
              key={exp._id} 
              experience={exp} 
              onSelect={() => onSelectExperience(exp)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Experience Card Component
interface ExperienceCardProps {
  experience: Experience;
  onSelect: () => void;
}

function ExperienceCard({ experience, onSelect }: ExperienceCardProps) {
  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={experience.image} 
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-semibold text-gray-900">Rs {experience.price}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
            {experience.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {experience.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {experience.shortDescription}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{experience.rating}</span>
            <span className="text-gray-500">({experience.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{experience.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Details Page Component
interface DetailsPageProps {
  experience: Experience;
  onBack: () => void;
  onProceed: (data: BookingData) => void;
}

function DetailsPage({ experience, onBack, onProceed }: DetailsPageProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [participants, setParticipants] = useState(1);
  const [fullExperience, setFullExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperienceDetails();
  }, [experience._id]);

  const fetchExperienceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Experience>(`${API_BASE_URL}/experiences/${experience._id}`);
      setFullExperience(response.data);
      if (response.data.availability.length > 0) {
        setSelectedDate(response.data.availability[0].date);
      }
    } catch (err) {
      console.error('Failed to fetch details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedSlot || !fullExperience) {
      alert('Please select a time slot');
      return;
    }

    onProceed({
      experienceId: fullExperience._id,
      experienceTitle: fullExperience.title,
      experienceImage: fullExperience.image,
      price: fullExperience.price,
      selectedDate,
      selectedSlot: selectedSlot.time,
      participants,
    });
  };

  if (loading || !fullExperience) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const dateAvailability = fullExperience.availability.find((d: DateAvailability) => d.date === selectedDate);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back to experiences</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden mb-6">
            <img 
              src={fullExperience.image} 
              alt={fullExperience.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Title and Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {fullExperience.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{fullExperience.rating}</span>
                <span className="text-gray-500">({fullExperience.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{fullExperience.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{fullExperience.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{fullExperience.duration}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About this experience</h2>
            <p className="text-gray-600 leading-relaxed">{fullExperience.description}</p>
          </div>

          {/* Highlights */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Highlights</h2>
            <ul className="space-y-2">
              {fullExperience.highlights.map((highlight: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">What's Included</h3>
              <ul className="space-y-2">
                {fullExperience.included.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Not Included</h3>
              <ul className="space-y-2">
                {fullExperience.notIncluded.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">${fullExperience.price}</span>
                <span className="text-gray-500">per person</span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Date
              </label>
              <div className="grid grid-cols-1 gap-2">
                {fullExperience.availability.map((avail: DateAvailability) => (
                  <button
                    key={avail.date}
                    onClick={() => {
                      setSelectedDate(avail.date);
                      setSelectedSlot(null);
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedDate === avail.date
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(avail.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            {dateAvailability && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dateAvailability.slots.map((slot: TimeSlot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={slot.available === 0}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        slot.available === 0
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : selectedSlot?.time === slot.time
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{slot.time}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {slot.available === 0 ? 'Sold Out' : `${slot.available} spots`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Number of Participants
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{participants}</div>
                </div>
                <button
                  onClick={() => setParticipants(Math.min(selectedSlot?.available || 10, participants + 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${(fullExperience.price * participants).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${(fullExperience.price * participants).toFixed(2)}</span>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleProceed}
              disabled={!selectedSlot}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout Page Component
interface CheckoutPageProps {
  bookingData: BookingData;
  onBack: () => void;
  onComplete: (result: BookingResult) => void;
}

function CheckoutPage({ bookingData, onBack, onComplete }: CheckoutPageProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const subtotal = bookingData.price * bookingData.participants;
  const total = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      return;
    }

    try {
      setValidatingPromo(true);
      const response = await axios.post<PromoValidationResponse>(`${API_BASE_URL}/promo/validate`, {
        code: promoCode,
        subtotal,
      });

      if (response.data.valid) {
        setDiscount(response.data.discount);
        setPromoMessage(response.data.message);
        setPromoApplied(true);
      }
    } catch (err) {
      const error = err as any;
      setPromoMessage(error.response?.data?.message || 'Invalid promo code');
      setDiscount(0);
      setPromoApplied(false);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/bookings`, {
        experienceId: bookingData.experienceId,
        selectedDate: bookingData.selectedDate,
        selectedSlot: bookingData.selectedSlot,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        participants: bookingData.participants,
        promoCode: promoApplied ? promoCode : '',
        discount,
        subtotal,
        total,
      });

      onComplete({
        success: true,
        booking: response.data.booking,
      });
    } catch (err) {
      const error = err as any;
      onComplete({
        success: false,
        error: error.response?.data?.error || 'Booking failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Promo Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={promoApplied}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-50"
                  placeholder="Enter promo code"
                />
                <button
                  type="button"
                  onClick={validatePromo}
                  disabled={promoApplied || validatingPromo}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {validatingPromo ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {promoMessage && (
                <p className={`mt-2 text-sm ${promoApplied ? 'text-green-600' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Try: SAVE10, FLAT100, WELCOME20
              </p>
            </div>
          </form>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

            <div className="mb-4">
              <img 
                src={bookingData.experienceImage} 
                alt={bookingData.experienceTitle}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-900 mb-2">{bookingData.experienceTitle}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(bookingData.selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{bookingData.selectedSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{bookingData.participants} {bookingData.participants === 1 ? 'participant' : 'participants'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>${bookingData.price} x {bookingData.participants}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Result Page Component
interface ResultPageProps {
  result: BookingResult;
  onGoHome: () => void;
}

function ResultPage({ result, onGoHome }: ResultPageProps) {
  if (result.success && result.booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{result.booking.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{result.booking.experienceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(result.booking.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{result.booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Participants:</span>
                <span className="font-medium">{result.booking.participants}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-900 font-semibold">Total Paid:</span>
                <span className="font-bold text-lg">${result.booking.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onGoHome}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Book Another Experience
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Failed</h1>
        <p className="text-gray-600 mb-6">
          {result.error || 'Something went wrong with your booking. Please try again.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={onGoHome}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}



