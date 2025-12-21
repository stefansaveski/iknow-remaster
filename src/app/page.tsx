"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash,
  faSignInAlt,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login({ email: formData.email, password: formData.password });
      window.location.href = '/students/profile';
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="min-h-screen ">
        {/* Login Form */}
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-white px-8 py-6 text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full">
                  <FontAwesomeIcon icon={faUser} className="text-2xl text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Добредојде</h1>
              <p className="text-blue-100 text-sm">
                Најавете се во вашиот IKnow акаунт
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Внесете е-пошта
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Внесете е-пошта"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Лозинка
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Внесете лозинка"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FontAwesomeIcon 
                        icon={showPassword ? faEyeSlash : faEye} 
                        className="h-4 w-4" 
                      />
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Запомни ме
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-blue-700 font-medium transition-colors"
                  >
                    Заборавена лозинка?
                  </button>
                </div>

                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-blue-700 disabled:opacity-60 disabled:hover:bg-primary text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="h-4 w-4" />
                  {isSubmitting ? 'Најави се...' : 'Најави се'}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-600">
                Немате акаунт?{' '}
                <button className="text-primary hover:text-blue-700 font-medium transition-colors">
                  Контактирајте ја администрацијата
                </button>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-80 rounded-lg shadow-sm">
              <FontAwesomeIcon icon={faGraduationCap} className="text-primary" />
              <span className="text-sm text-gray-600">
                Студентски информационен систем
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}