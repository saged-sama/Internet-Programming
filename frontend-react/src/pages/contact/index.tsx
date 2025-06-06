import Layout from '../../components/layout/Layout';
import themeClasses from '../../lib/theme-utils';
import ContactInfo from '../../components/contact/ContactInfo';
import DepartmentContacts from '../../components/contact/DepartmentContacts';
import ContactForm from '../../components/contact/ContactForm';
import ContactMap from '../../components/contact/ContactMap';

export default function ContactPage() {
  return (
    <Layout>
      <div className="bg-background py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className={themeClasses.textPrimary}>Contact Us</h1>
            <p className={`${themeClasses.textPrimaryLight} max-w-3xl mx-auto`}>
              Have questions or need assistance? Reach out to us using the form below or contact the appropriate department directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <ContactInfo />
              <DepartmentContacts />
            </div>
            <ContactForm />
          </div>
          <ContactMap />
        </div>
      </div>
    </Layout>
  );
}
