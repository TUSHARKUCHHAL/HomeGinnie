// src/components/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="mr-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">HomeGinnie</span>
              </div>
              <p className="text-gray-400 mb-6">
                India's all-in-one hyperlocal services and smart shopping platform designed to make home maintenance and shopping easier.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Plumbing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Electrical</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carpentry</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Painting</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cleaning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AC Repair</a></li>
              </ul>
            </div>
            
            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Shopping</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hardware</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Appliances</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Groceries</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Daily Essentials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Deals</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner With Us</a></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="max-w-md mx-auto lg:mx-0">
              <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
              <p className="text-gray-400 mb-4">Get the latest updates on new services and exclusive offers.</p>
              <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Download App Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Download our app</h3>
              <p className="text-gray-400">Get the full HomeGinnie experience on your mobile</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="flex items-center bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg">
                <svg className="w-7 h-7 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9 3H6.1C5.1 3 4.2 3.9 4.2 5v14c0 1.1 0.9 2 2 2h11.8c1.1 0 2-0.9 2-2V5c-0.1-1.1-1-2-2.1-2zm-5.9 18c-0.8 0-1.5-0.7-1.5-1.5S11.2 18 12 18s1.5 0.7 1.5 1.5S12.8 21 12 21zm6-4H6V5h12v12z" />
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
              <a href="#" className="flex items-center bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg">
                <svg className="w-7 h-7 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.3 7.3c-1-1.2-2.3-1.9-3.8-1.9-1.6 0-2.8 0.8-3.6 1.3-0.8-0.5-2-1.3-3.6-1.3-1.4 0-2.7 0.7-3.8 1.9-1 1.2-1.5 2.7-1.5 4.4 0 1.4 0.5 2.6 1.3 3.6l6.8 7c0.2 0.2 0.5 0.3 0.8 0.3 0.3 0 0.6-0.1 0.8-0.3l6.8-7c0.8-1 1.3-2.2 1.3-3.6 0-1.7-0.5-3.2-1.5-4.4z" />
                </svg>
                <div>
                  <div className="text-xs">DOWNLOAD ON THE</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 HomeGinnie. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-x-8">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Partner Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;