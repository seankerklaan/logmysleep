import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Moon, Star, BookOpen, Sparkles, Trophy, 
  ArrowRight, CheckCircle, Calendar,
  Coffee, Wine, Dumbbell, BedDouble, Sun
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 mb-8">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">14-Day Sleep Challenge</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Sleep with{' '}
              <span className="relative inline-block">
                Simple Notes
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-600/30"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your bedside companion for better sleep. Just like writing in a journal, 
              but smarter. Build lasting habits in just 14 days.
            </p>

            {/* App Interface Preview */}
            <div className="relative mx-auto max-w-5xl mb-12 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6">
                {/* Sleep Grid Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <Moon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Asleep</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 text-amber-600 rounded-full">
                      <Sun className="w-4 h-4" />
                      <span className="text-sm font-medium">Awake</span>
                    </div>
                  </div>
                </div>

                {/* Sleep Grid */}
                <div className="grid grid-cols-[auto_repeat(12,_1fr)] gap-1 mb-4 text-sm">
                  <div className="font-medium p-2">Time</div>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="text-center p-2">{`${(i + 20) % 24}:00`}</div>
                  ))}
                  
                  {Array.from({ length: 3 }).map((_, day) => (
                    <React.Fragment key={day}>
                      <div className="font-medium p-2">Day {day + 1}</div>
                      {Array.from({ length: 12 }).map((_, hour) => {
                        const isAsleep = hour >= 3 && hour <= 8;
                        return (
                          <div
                            key={hour}
                            className={`h-8 ${
                              isAsleep ? 'bg-indigo-500' : 'bg-gray-100'
                            } rounded transition-colors`}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>

                {/* Activity Icons */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-4 h-4" />
                    <span>Caffeine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wine className="w-4 h-4" />
                    <span>Alcohol</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4" />
                    <span>Exercise</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BedDouble className="w-4 h-4" />
                    <span>Sleep Position</span>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Coffee className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Caffeine</div>
                        <div className="text-2xl font-bold text-gray-900">7</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Wine className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Alcohol</div>
                        <div className="text-2xl font-bold text-gray-900">3</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Dumbbell className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Exercise</div>
                        <div className="text-2xl font-bold text-gray-900">1</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Moon className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Sleep</div>
                        <div className="text-2xl font-bold text-gray-900">37h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105"
              >
                Start Your Sleep Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Simple Steps */}
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">1. Note Before Bed</h3>
                <p className="text-gray-600 text-sm">
                  Quick bedside notes about your day's activities and sleep routine
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">2. Track 14 Days</h3>
                <p className="text-gray-600 text-sm">
                  Follow your personalized 14-day journey with daily encouragement
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">3. See Results</h3>
                <p className="text-gray-600 text-sm">
                  Watch your sleep improve as you build better habits
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Personal Sleep Journey
            </h2>
            <p className="text-xl text-gray-600">
              More than just tracking sleep - build a lasting bedtime routine that works for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Daily Encouragement
                  </h3>
                  <p className="text-gray-600">
                    Receive gentle reminders and positive reinforcement through SMS, 
                    helping you stay on track with your sleep goals
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Achievement System
                  </h3>
                  <p className="text-gray-600">
                    Earn badges and track your progress as you build better sleep habits 
                    throughout your 14-day journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Sleep?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands who've discovered the power of simple bedside notes. 
              Start your journey to better sleep today.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 transition-all transform hover:scale-105"
            >
              Begin Your 14-Day Journey
            </Link>
            <p className="mt-4 text-indigo-200 text-sm">
              No complex tracking • Just simple notes • Build lasting habits
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;