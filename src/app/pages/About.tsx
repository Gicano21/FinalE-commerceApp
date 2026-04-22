import { Award, Users, Globe, Heart, PersonStanding } from "lucide-react";

export function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">About TechStore</h1>
        <p className="text-xl text-gray-600">
          We the Group 1 proudly made a signatures and make a history that we are proudly of.
          - GGKVO 2026.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To provide customers with access to the latest and greatest
            technology products at competitive prices, while delivering
            exceptional customer service and support.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 md:grid-cols-4 gap-8 mb-20">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">5+</div>
          <div className="text-gray-600">Happy Customers</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">9+</div>
          <div className="text-gray-600">Products</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">8+</div>
          <div className="text-gray-600">Brands</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">24/7</div>
          <div className="text-gray-600">Support</div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600 text-sm">
              "By prioritizing devices with long-term firmware support and using honest, functional descriptions to match products with specific user needs, a brand builds lasting consumer trust and minimizes the waste associated with premature obsolescence and high return rates".
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Customer Focus</h3>
            <p className="text-gray-600 text-sm">
               "A truly customer-centric gadget brand transforms from a mere vendor into a lifelong partner by prioritizing radical technical empathy, ensuring every innovation is matched perfectly to the user's unique workflow and long-term satisfaction."
            </p><br/>
          
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Reach</h3>
            <p className="text-gray-600 text-sm">
               "True digital accessibility is found when global innovation meets immediate neighborhood availability, transforming a vast inventory into a reliable, hand-delivered solution for the community."
              
            </p><br/>
       
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Passion</h3>
            <p className="text-gray-600 text-sm">
              "True innovation is fueled by a relentless commitment to excellence, where a genuine love for the craft transforms every piece of technology from a mere tool into a masterpiece of purpose and inspiration."
            </p> <br/>
           
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <PersonStanding className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Respect</h3>
            <p className="text-gray-600 text-sm">
              "True integrity in the gadget world is built on a deep reverence for the user’s time and investment, ensuring every device is crafted with the honesty, durability, and performance that every individual deserves."
            </p><br />
           
          </div>
        </div>
      </div>
    </div>
  );
}
