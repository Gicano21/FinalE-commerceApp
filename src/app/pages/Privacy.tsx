import { Award, Users, Globe, Heart, ShieldCheck, Mail, Lock, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <Link to="/signup" className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sign Up
      </Link>

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">To our fellow customers</h1>
        <p className="text-xl text-gray-600">
          We, the Group 1, proudly made a signature and made history that we are proud of.
          <span className="block mt-2 font-semibold text-blue-600">- GGKVO 2026.</span>
        </p>
      </div>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden">
          
          {/* Brand Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 text-center">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">TechStore Privacy Policy</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              At TechStore, we value your privacy and are committed to protecting your personal data. 
              This policy explains how we handle your info when you explore our gadget universe.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-10 text-gray-700">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Info size={20}/></div>
                <h3 className="text-2xl font-bold text-gray-900">1. Information We Collect</h3>
              </div>
              <ul className="grid md:grid-cols-2 gap-4 ml-2">
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold block text-blue-600">Identifiers</span> 
                  Name, shipping/billing address, and email address.
                </li>
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold block text-blue-600">Payment</span> 
                  Secure tokens for credit cards (processed via encrypted gateways).
                </li>
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold block text-blue-600">Technical Data</span> 
                  IP address, device info, and cookies for your cart.
                </li>
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold block text-blue-600">Account</span> 
                  Encrypted passwords and usernames.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Info</h3>
              <div className="space-y-3">
                {[
                  "Order Fulfillment & Shipping",
                  "Customer Support & Warranty Claims",
                  "Security & Fraud Prevention",
                  "Marketing (Only if you opt-in)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 & 4 (Combined for clean look) */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-blue-900 mb-2">3. Sharing</h3>
                <p className="text-sm">We don't sell data. We only share with logistics partners (couriers) and legal authorities if required.</p>
              </section>
              <section className="bg-purple-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">4. Data Security</h3>
                <p className="text-sm">We use SSL encryption and firewalls. Note: No online method is 100% immune to risks.</p>
              </section>
            </div>

            {/* Section 5 & 6 */}
            <section className="border-t pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights & Cookies</h3>
              <p className="mb-4 leading-relaxed">
                You have the right to access, correct, or delete your data at any time. 
                We use cookies to make the shop functional; you can disable these in your browser settings.
              </p>
            </section>

            <section className="border-t pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Security Measures</h3>
              <p className="mb-4 leading-relaxed">
                We use industry-leading encryption to protect your data. Think of it like a "Digital Vault." While no system is 100% unhackable, we constantly update our security protocols to defend against new threats.
              </p>
            </section>


            {/* Contact */}
            <footer className="bg-gray-900 text-white p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">7. Questions?</h3>
                <p className="text-gray-400">Reach out to our support team anytime.</p>
              </div>
              <div className="space-y-2 text-right">
                <Link to="/contact">
                  <div className="flex items-center gap-2 justify-end">
                    <Mail size={16} className="text-blue-400" />
                    <span>yawningeverytime@gmail.com</span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 justify-end text-sm text-gray-400">
                  <Globe size={16} />
                  <span><a href="https://www.google.com/maps/place/14%C2%B010'53.6%22N+122%C2%B023'29.4%22E/@14.181347,122.3912999,169m/data=!3m1!1e3!4m4!3m3!8m2!3d14.1815667!4d122.3914863?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Group 1 HQ, Sta Elena, Camarines Norte, Philippines</a></span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}