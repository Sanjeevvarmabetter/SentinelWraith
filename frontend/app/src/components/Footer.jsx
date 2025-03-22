import React from "react";

const Footer = () => {
    return(
             
        <div>

                  {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-3 mt-6">
        <p>&copy; {new Date().getFullYear()} Malware Detector. All rights reserved.</p>
      </footer>
        </div>
        
    )
};

export default Footer;
