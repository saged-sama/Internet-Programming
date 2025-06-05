import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';

export default function RegistrationSuccessPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[#13274D]">
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
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-md text-gray-700 mb-6">
                Your registration request has been submitted successfully. 
                An administrator will review your account information and approve your access.
              </p>
              
              <p className="text-md text-gray-700 mb-6">
                You will receive an email notification at your provided email address once your account has been approved.
              </p>

              <div className="mt-6 space-y-4">
                <Button
                  className="w-full bg-[#ECB31D] hover:bg-[#F5C940] text-[#13274D] font-medium"
                  asChild
                >
                  <Link to="/auth/login">
                    Go to Login
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-[#13274D] text-[#13274D] hover:bg-[#13274D] hover:text-white"
                  asChild
                >
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
