import React, { useState } from 'react';
import { Battery, Smartphone, Volume2, AlertTriangle } from 'lucide-react';
import NoiseCalibrator from './NoiseCalibrator';

const AudioSetup = () => {
  const [step, setStep] = useState(1);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const steps = [
    {
      icon: <Battery className="w-12 h-12 text-indigo-600" />,
      title: "Charge Your Phone",
      description: "Ensure your phone is charged above 50% to record through the night.",
      image: "https://images.unsplash.com/photo-1592436259366-18ab6da5f195?auto=format&fit=crop&q=80&w=300"
    },
    {
      icon: <Smartphone className="w-12 h-12 text-indigo-600" />,
      title: "Position Your Phone",
      description: "Place your phone within arm's reach of your pillow, with the microphone facing your head.",
      image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=300"
    },
    {
      icon: <Volume2 className="w-12 h-12 text-indigo-600" />,
      title: "Calibrate Background Noise",
      description: "Let's measure your room's ambient noise level to set the right threshold.",
      component: <NoiseCalibrator onComplete={() => setStep(4)} />
    }
  ];

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= step ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Current Step */}
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        {steps[step - 1].icon}
        <h3 className="text-xl font-semibold mt-4 mb-2">
          {steps[step - 1].title}
        </h3>
        <p className="text-gray-600 mb-6">
          {steps[step - 1].description}
        </p>

        {steps[step - 1].image && (
          <img
            src={steps[step - 1].image}
            alt={steps[step - 1].title}
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
        )}

        {steps[step - 1].component}

        {step < 3 && (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Pro Tip</h4>
          <p className="text-blue-800 text-sm">
            {step === 1 && "Recording sleep sounds uses about 15% battery per night."}
            {step === 2 && "Keep your phone plugged in and place it on a stable surface."}
            {step === 3 && "The quieter your room during calibration, the better we can detect snoring."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioSetup;