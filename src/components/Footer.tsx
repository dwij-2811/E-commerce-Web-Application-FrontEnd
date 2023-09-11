import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/nutrition">Nutrition</a></li>
              <li><a href="/terms-of-service">Terms of Service</a></li>
              {/* Add more links as needed */}
            </ul>
          </div>
          <div className="col-md-3">
            <h3>Follow Us</h3>
            {/* Add social media icons/links here if desired */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
