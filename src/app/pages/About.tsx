import { Award, Users, Globe, Heart, PersonStanding } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts, refreshUsers } from "../utils/myDatabase";

export function About() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      const users = await refreshUsers();
      const products = await getAllProducts();

      if (!active) return;
      setUserCount(users.length);
      setProductCount(products.length);
    }

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">About TechStore</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch mb-20">
  {/* Mission */}
  <div className="w-full max-w-4xl mx-auto flex">
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Our Mission</h2>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
        To provide customers with access to the latest and greatest
        technology products at competitive prices, while delivering
        exceptional customer service and support.
      </p>
    </div>
  </div>

  {/* About Group 1 */}
  <div className="w-full max-w-4xl mx-auto flex">
    <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-12 text-center flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Our History</h2>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
        We the Group 1 proudly made our signatures and made a history that we are proud of.
        <span className="block mt-2 font-semibold">- GGKVO 2026.</span>
      </p>
    </div>
  </div>
</div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {userCount !== null ? `${userCount}+` : "..."}
          </div>
          <div className="text-gray-600 md:text-lg">Current Users</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {productCount !== null ? `${productCount}+` : "..."}
          </div>
          <div className="text-gray-600 md:text-lg">Products</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">24/7</div>
          <div className="text-gray-600 md:text-lg">Support</div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600 text-sm md:text-normal lg:text-lg">
              "By prioritizing devices with long-term firmware support and using honest, functional descriptions to match products with specific user needs, a brand builds lasting consumer trust and minimizes the waste associated with premature obsolescence and high return rates".
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">Customer Focus</h3>
            <p className="text-gray-600 text-sm  md:text-normal lg:text-lg">
               "A truly customer-centric gadget brand transforms from a mere vendor into a lifelong partner by prioritizing radical technical empathy, ensuring every innovation is matched perfectly to the user's unique workflow and long-term satisfaction."
            </p><br/>
          
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">Local Reach</h3>
            <p className="text-gray-600 text-sm md:text-normal lg:text-lg">
               "True digital accessibility is found when global innovation meets immediate neighborhood availability, transforming a vast inventory into a reliable, hand-delivered solution for the community."
              
            </p><br/>
       
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">Passion</h3>
            <p className="text-gray-600 text-sm md:text-normal lg:text-lg">
              "True innovation is fueled by a relentless commitment to excellence, where a genuine love for the craft transforms every piece of technology from a mere tool into a masterpiece of purpose and inspiration."
            </p> <br/>
           
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <PersonStanding className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">Respect</h3>
            <p className="text-gray-600 text-sm md:text-normal lg:text-lg">
              "True integrity in the gadget world is built on a deep reverence for the user’s time and investment, ensuring every device is crafted with the honesty, durability, and performance that every individual deserves."
            </p><br />
           
          </div>
        </div>
      </div>
    </div>
  );
}
