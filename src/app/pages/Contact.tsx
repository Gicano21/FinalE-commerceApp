import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
// Assuming you have a toast library like 'sonner' or 'react-hot-toast'
import { toast } from "sonner"; 

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // These states are required because your handleSubmit function uses them
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FIX 1: Added 'async' so we can use 'await'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(null);     // Reset errors

    const { name, email, subject, message } = formData;

    console.log("Form Submitted!");

    // FIX 2: Wrapped in a 'try' block so the 'catch' works
    try {
      const res = await fetch("https://finale-commerceserver.onrender.com/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            Email: email, 
            Name: name, 
            Subject: subject, 
            Message: message 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send your feedback, please try again.");
      }

      // Success logic
      alert(`Thanks for reaching out, ${name}! Your message has been "sent".`);
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
      setIsLoading(false);

    } catch (err) {
      // FIX 3: This catch now belongs to the try above
      const msg = err instanceof Error ? err.message : "Failed to send feedback";
      setError(msg);
      
      toast.error("Feedback failed to send", {
        description: msg,
      });
      
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600">
          Have a question? We'd love to hear from you. Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Send us a Message</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg md:text-xl lg:text-2xl font-medium mb-2">Name</label>
              <div className="relative w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 pb-[5px]">
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="text-normal md:text-lg lg:text-xl w-full px-4 py-3 bg-white border border-black rounded-t-lg rounded-b-[3px] focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Your name"
    required
  />
</div>

            </div>

            <div>
              <label className="block text-lg md:text-xl lg:text-2xl font-medium mb-2">Email</label> 
              <div className="relative w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 pb-[3px]">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-normal md:text-lg lg:text-xl w-full px-4 py-3 bg-white border border-black rounded-t-lg rounded-b-[3px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
              </div>
            </div>

            <div>
              <label className="block text-lg md:text-xl lg:text-2xl font-medium mb-2">Subject</label>
              <div className="relative w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 pb-[3px]">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="text-normal md:text-lg lg:text-xl w-full px-4 py-3 bg-white border border-black rounded-t-lg rounded-b-[3px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help?"
                required
              />
              </div>
            </div>

            <div>
              <label className="block text-lg md:text-xl lg:text-2xl font-medium mb-2">Message</label>
              <div className="relative w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 pb-[3px]">
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="text-normal md:text-lg lg:text-xl w-full px-4 py-3 bg-white border border-black rounded-t-lg rounded-b-[3px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message..."
                required
              />
              </div>
            </div>

            {/* Added loading state to the button */}
            <Button type="submit" className="w-full text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-purple-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 text-white" size="lg" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>

        {/* Contact Info (Kept exactly as you provided) */}
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-6">Contact Information</h2>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg md:text-xl lg:text-2xl">Email</h3>
                <p className="text-gray-600 text-normal md:text-lg lg:text-xl">yawningeverytime@gmail.com</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg md:text-xl lg:text-2xl">Phone</h3>
                <p className="text-gray-600 text-normal md:text-lg lg:text-xl">+63 923-366-7846</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg md:text-xl lg:text-2xl">Address</h3>
                <a href="https://www.google.com/maps/place/14%C2%B010'53.6%22N+122%C2%B023'29.4%22E/@14.181347,122.3912999,169m/data=!3m1!1e3!4m4!3m3!8m2!3d14.1815667!4d122.3914863?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D" className="text-gray-600 text-normal md:text-lg lg:text-xl">Purok 7 brgy. Poblacion Sta. Elena Camarines Norte</a>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-lg md:text-xl lg:text-2xl">Business Hours</h3>
            <div className="space-y-1 text-normal md:text-lg lg:text-xl text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Saturday</span>
                <span>24 Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Maintenance/L-Ligo Kami</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}