import { Scale, ShoppingBag, Ban, AlertCircle, RefreshCcw, Mail, Globe, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function UserAgreement() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <Link to="/signup" className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sign Up
      </Link>

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">The TechStore Covenant</h1>
        <p className="text-xl text-gray-600">
          By using our platform, you agree to these terms. No fine print, just fair play.
          <span className="block mt-2 font-semibold text-purple-600">- Group 1 Standards.</span>
        </p>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden">
          
          {/* Brand Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-12 text-center">
            <Scale className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">User Agreement</h2>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Welcome to the TechStore community. These terms govern your use of our services, 
              ensuring a safe and reliable gadget shopping experience for everyone.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-10 text-gray-700">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><ShoppingBag size={20}/></div>
                <h3 className="text-2xl font-bold text-gray-900">1. Account Eligibility</h3>
              </div>
              <p className="mb-4 leading-relaxed">
                To shop at TechStore, you must provide accurate info. You are responsible for keeping your password secret. 
                One person, one account—let's keep the gadget universe organized!
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">2. Prohibited Conduct</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: <Ban size={18} />, title: "No Bots", desc: "Automated buying is strictly prohibited." },
                  { icon: <AlertCircle size={18} />, title: "Fair Play", desc: "No fraudulent claims or chargeback abuse." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-red-100 bg-red-50/30 rounded-xl">
                    <div className="text-red-500 mt-1">{item.icon}</div>
                    <div>
                      <span className="font-bold block text-gray-900">{item.title}</span>
                      <span className="text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 & 4 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-900">
                  <RefreshCcw size={18} />
                  <h3 className="text-xl font-bold">3. Returns & Refunds</h3>
                </div>
                <p className="text-sm">Items must be returned in original packaging within 7 days. TechStore reserves the right to refuse items with physical damage caused by the user.</p>
              </section>
              <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2 text-amber-900">
                  <FileText size={18} />
                  <h3 className="text-xl font-bold">4. Product Info</h3>
                </div>
                <p className="text-sm">We strive for 100% accuracy, but TechStore is not liable for minor typographical errors in pricing or technical specs.</p>
              </section>
            </div>

            {/* Section 5 */}
            <section className="border-t pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h3>
              <p className="mb-4 leading-relaxed italic border-l-4 border-purple-200 pl-4 text-gray-600">
                "TechStore provides this platform 'as is.' We aren't responsible for any existential crises caused by your new high-performance laptop running too fast, nor for indirect losses resulting from site downtime."
              </p>
            </section>

            {/* Section 6 */}
            <section className="border-t pt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Amendments</h3>
              <p className="mb-4 leading-relaxed">
                We might update these terms as TechStore grows. We will notify you via email of any "Game Changing" updates. Continued use of the site means you accept the new rules.
              </p>
            </section>

            {/* Contact Footer */}
            <footer className="bg-gray-900 text-white p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Legal Help?</h3>
                <p className="text-gray-400">Our compliance team is here to clarify.</p>
              </div>
              <div className="space-y-2 text-right">
                <Link to="/contact">
                  <div className="flex items-center gap-2 justify-end">
                    <Mail size={16} className="text-purple-400" />
                    <span>legal@techstore.ggkvo.com</span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 justify-end text-sm text-gray-400">
                  <Globe size={16} />
                  <span><a href="https://www.google.com/maps/place/14%C2%B010'53.6%22N+122%C2%B023'29.4%22E/@14.181347,122.3912999,169m/data=!3m1!1e3!4m4!3m3!8m2!3d14.1815667!4d122.3914863?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Group 1 HQ, Sta Elena, Camarines Norte</a></span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}