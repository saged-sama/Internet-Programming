import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';

export default function RegistrationSuccessPage() {
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full ${themeClasses.bgAccentYellow} mb-4`}>
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className={`mt-6 text-center text-3xl font-extrabold ${themeClasses.textPrimary}`}>
              Registration Successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Thank you for registering with the Department of Computer Science and Engineering,
              <br />
              University of Dhaka
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className={`max-w-md w-full bg-white p-8 rounded-lg shadow-md border-t-4 ${themeClasses.borderPrimary}`}>
            <div className="text-center">
              <p className="text-md text-gray-700 mb-6">
                Your registration request has been submitted successfully. 
                An administrator will review your account information and approve your access.
              </p>
              
              <p className="text-md text-gray-700 mb-6">
                You will receive an email notification at your provided email address once your account has been approved.
              </p>

              <div className="mt-6 space-y-4">
                <Button className={themeClasses.primaryButton + " font-medium"} asChild>
                  <Link to="/auth/login">
                    Go to Login
                  </Link>
                </Button>
                
                <Button variant="outline" className={`${themeClasses.outlineButton}`} asChild>
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
