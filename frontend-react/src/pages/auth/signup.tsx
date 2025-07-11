import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import themeClasses, { themeValues } from '../../lib/theme-utils';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'student', // Default role
    id: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@cse.du.ac.bd') && !formData.email.endsWith('@du.ac.bd') && !formData.email.endsWith('@cs.du.ac.bd')) {
      newErrors.email = 'Please use your institutional email (@cs.du.ac.bd, @cse.du.ac.bd or @du.ac.bd)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (formData.role === 'student' && !formData.id) {
      newErrors.id = 'Student ID is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const form = (new FormData(e.target as HTMLFormElement));
      form.delete("agreeToTerms");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        body: form,
      })

      if(!response.ok){
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      navigate("/auth/registration-success");
    } catch (err) {
      setErrors({ form: 'Registration failed. Please try again later.' });
      console.error('Registration error:', err);
    }
    setIsLoading(false);

  };

  return (

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <div>
          
            <h2 className={`mt-6 text-center text-3xl font-extrabold ${themeClasses.textPrimary}`}>
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Department of Computer Science and Engineering
              <br />
              University of Dhaka
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {errors.form && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="firstname"
                      placeholder='First Name'
                      id="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.firstname ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm`}
                    />
                    {errors.firstname && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="lastname"
                      placeholder='Last Name'
                      id="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.lastname ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm`}
                    />
                    {errors.lastname && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Institutional Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm`}
                    placeholder="username@cse.du.ac.bd"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              {formData.role === 'student' && (
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                    Student ID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="id"
                      id="id"
                      value={formData.id}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.id ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm`}
                      placeholder="e.g., 2021-1-60-001"
                    />
                    {errors.id && (
                      <p className="mt-1 text-sm text-red-600">{errors.id}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ECB31D] focus:border-[#ECB31D] sm:text-sm`}
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 ${themeClasses.textPrimary} focus:ring-[${themeValues.colors.accentYellow}] border-gray-300 rounded ${errors.agreeToTerms ? 'border-red-300' : ''}`}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-[#13274D] hover:text-[#31466F]">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-[#13274D] hover:text-[#31466F]">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
              )}

              <div>
                <Button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${themeClasses.primaryButton} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${themeValues.colors.accentYellow}]`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign up'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/login" className={`font-medium ${themeClasses.textPrimary} hover:text-[${themeValues.colors.primaryLight}]`}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
