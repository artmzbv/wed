import React from 'react';
import './TermsOfUse.css';

const TermsOfUse = () => {
  return (
    <div className="terms-of-use-container">
    <div className="terms-of-use">
      <h1>Terms and Conditions</h1>
      <p><em>Last updated: 18.10.2024</em></p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          These Terms and Conditions govern the use of services provided by Self Made Portraits studio ("the studio"), operated by Robin O'Keeffe. 
          By booking a session, clients agree to these terms.
        </p>
      </section>

      <section>
        <h2>2. Booking and Payment</h2>
        <p>Sessions must be booked and paid for online on the self-made-portraits.com website. Walk-ins are not accepted. 
        Sessions' time frame, as well as the price for each session, is indicated on the studio's scheduling page.</p>
      </section>

      <section>
        <h2>2.1. Cancellation and Refund</h2>
        <p>Clients can cancel or reschedule up to 20 hours before the booking via the link provided in the confirmation email.</p>
      </section>

      <section>
        <h2>3. Studio Use</h2>
        <p>Clients are limited to the booked session time frame. In case of being late, session time will be reduced proportionally.</p>
        <p>The studio accommodates any number of clients, though a maximum of 5 is recommended for comfort and safety.</p>
        <p>Clients can bring make-up artists, any amount of clothes and props.</p>
        <p>Clients under 14 years old must be accompanied by an adult.</p>
        <p>Usage instructions must be followed to receive results.</p>
      </section>

      <section>
        <h2>3.1. Usage Instructions</h2>
        <p>
          A camera is hidden behind a look-through mirror, a flashlight is set up in front of the mirror, and a remote clicker synchronises these two. 
          To get the best shot, stay within the marks on the floor showing the frame limitations. 
          Press the button on the remote to take a picture of what you see in the mirror.
        </p>
        <p>Clients can use any additional equipment found in the studio, including chairs, stools, a fan, and a tripod for smartphones.</p>
      </section>

      <section>
        <h2>4. Conduct and Safety</h2>
        <ul>
          <li>No food or drinks allowed.</li>
          <li>No touching the mirror is allowed.</li>
          <li>Clients should be barefoot, in socks, or have shoes covered with paper tape.</li>
          <li>No alterations, decorations or additions to the studio are permitted without written consent.</li>
          <li>No fire or smoking of any kind is permitted in the studio and the entire building.</li>
          <li>Clients are not to use the studio for any activities which are dangerous, offensive, illegal, or immoral.</li>
        </ul>
      </section>

      <section>
        <h2>5. Post-Session Procedures</h2>
        <p>Clients have to gather all their belongings and leave the studio in the same condition it was when the session started.</p>
        <p>Photos are processed automatically and delivered within 24 hours post-session via email provided at booking.</p>
        <p>Photos will be available for download for 7 days, then automatically deleted.</p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <h3>6.1. Studio Liability</h3>
        <p>The studio shall not be liable for injuries sustained during unsupervised sessions.</p>
        <p>The studio is not liable for any loss or damage to client materials, props, or equipment.</p>
        <p>In case of equipment malfunction, the studio offers rescheduling or a refund depending on the session’s status.</p>
        <p>Personal items left behind will be stored for 30 days, after which they will be disposed of.</p>

        <h3>6.2. Client Liability</h3>
        <p>Clients are responsible for any damage to the studio's contents, equipment, and facilities during their use.</p>
        <p>Clients shall cover any costs incurred due to damage or breach of these conditions.</p>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>All photographs taken belong to the client, as they are the photographer. The photo studio only processes and stores photos to provide the service.</p>
        <p>The studio grants clients a non-exclusive, non-transferable, revocable licence to access the services in compliance with these Terms and Conditions.</p>
      </section>

      <section>
        <h2>8. Changes to Terms and Conditions</h2>
        <p>These terms may be updated periodically. Clients are advised to review this page for changes.</p>
      </section>

      <section>
        <h2>9. Governing Law and Dispute Resolution</h2>
        <p>These terms are governed by UK law. Disputes will be resolved through negotiations or, if necessary, in a UK court.</p>
      </section>

      <section>
        <h2>10. Acceptance of Terms</h2>
        <p>By booking a session, clients acknowledge that they have read, understood, and agreed to these Terms and Conditions.</p>
      </section>
    </div>
    </div>
  );
};

export default TermsOfUse;
