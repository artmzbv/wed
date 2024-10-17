import React, { useEffect } from "react";
import "./CookiePolicy.css";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

return (
<div class="cookie-policy-container">
<div class="cookie-policy">
  <h1>Cookie Policy</h1>
  <p><em>Last updated: 18.10.2024</em></p>

  <section>
    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small files placed on your device to help us provide you with a better user experience. They allow us to recognize your device, store your preferences, and gather browsing information.</p>
  </section>

  <section>
    <h2>2. Types of Cookies We Use</h2>
    <ul>
      <li><strong>Necessary Cookies:</strong> Essential for the operation of our site.</li>
      <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site.</li>
      <li><strong>Functional Cookies:</strong> Remember your preferences and improve your experience.</li>
      <li><strong>Advertising Cookies:</strong> Deliver relevant ads based on your browsing history.</li>
    </ul>
  </section>

  <section>
    <h2>3. Third-Party Cookies</h2>
    <p>We use third-party cookies for analytics and advertising purposes. These cookies may track your browsing activity across different websites. For more information, please visit:</p>
    <ul>
      <li><a href="https://policies.google.com/privacy" target="_blank">Google Analytics Privacy Policy</a></li>
      <li><a href="https://www.facebook.com/policy.php" target="_blank">Facebook Pixel Privacy Policy</a></li>
    </ul>
  </section>

  <section>
    <h2>4. Managing Cookies</h2>
    <p>You can control and manage cookies using your browser settings. Most browsers allow you to refuse cookies or delete them. Please note that blocking cookies may affect the functionality of our site.</p>
  </section>

  <section>
    <h2>5. Updates to This Policy</h2>
    <p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our cookie practices.</p>
  </section>

  <section>
    <h2>6. Contact Us</h2>
    <p>If you have any questions about our use of cookies, please contact us at info@self-made-portraits.com.</p>
  </section>
</div>
</div>
)}

export default CookiePolicy;
