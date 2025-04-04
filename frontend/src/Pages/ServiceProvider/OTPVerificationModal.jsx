import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const OTPVerificationModal = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [timer, setTimer] = useState(60);
  
  // Handle OTP input change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    
    // Auto focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  // Handle keydown for backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6);
    
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 6) {
          newOtp[i] = pasteData[i];
        }
      }
      
      setOtp(newOtp);
      
      // Focus the appropriate field
      if (pasteData.length < 6) {
        inputRefs[pasteData.length].current.focus();
      } else {
        inputRefs[5].current.focus();
      }
    }
  };

  // Submit OTP
  const verifyOTP = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (otpValue === '123456') { // For demo, consider 123456 as correct OTP
        setIsSuccess(true);
        setError('');
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  // Resend OTP
  const resendOTP = () => {
    setTimer(60);
    setError('');
    // Animation to show OTP was sent
    setOtp(['', '', '', '', '', '']);
    inputRefs[0].current.focus();
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-slate-200/70 bg-opacity-50 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ${isSuccess ? 'scale-105' : 'scale-100'}`}>
        {/* Close button */}
        <button 
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isSuccess ? 'bg-green-100' : 'bg-slate-100'
            } transition-all duration-500`}>
              {isSuccess ? (
                <CheckCircle size={32} className="text-green-600" />
              ) : (
                <KeyRound size={32} className="text-slate-800" />
              )}
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Verify Your Account</h3>
          
          {/* Fixed positioning of the icon and text to match reference */}
          <div className="mt-4 text-slate-600 flex flex-col items-center">
            
            <p className="text-sm">
            <FontAwesomeIcon icon={faEnvelope} className="text-slate-600 mr-1" size="lg" /> We've sent a verification code to <br />
              
              <span className="font-medium">example@email.com</span>
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                className={`w-12 h-12 text-center text-lg font-bold rounded-lg bg-white text-slate-800 border-2 focus:outline-none focus:ring-2 transition-all ${
                  error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-slate-800 focus:ring-slate-200'
                }`}
              />
            ))}
          </div>
          
          {error && (
            <div className="flex items-center justify-center text-red-500 text-sm mb-4 animate-bounce">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={verifyOTP}
              disabled={isLoading || isSuccess}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center ${
                isSuccess 
                  ? 'bg-green-500'
                  : isLoading 
                    ? 'bg-slate-700 cursor-not-allowed' 
                    : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Verifying...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Verified!
                </>
              ) : (
                <>
                  <ShieldCheck size={18} className="mr-2" />
                  Verify Code
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-slate-600 text-sm flex items-center justify-center gap-1">
            <RefreshCw size={14} className={timer > 0 ? 'animate-spin' : ''} />
            Didn't receive the code?{' '}
            {timer > 0 ? (
              <span className="text-slate-800 font-medium">Resend in {timer}s</span>
            ) : (
              <button onClick={resendOTP} className="text-slate-900 font-medium hover:underline transition-all">
                Resend OTP
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;