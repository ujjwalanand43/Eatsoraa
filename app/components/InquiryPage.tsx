import {Link} from 'react-router';

export function InquiryPage({bulk = false}: {bulk?: boolean}) {
  return <section className={`inquiry-page${bulk ? ' inquiry-bulk' : ' inquiry-contact'}`}>
    {!bulk && <header className="inquiry-contact-heading">
      <p className="inquiry-kicker">CONTACT US</p>
      <h1>LET’S GET <span>IN TOUCH.</span></h1>
      <p>Have a question about your order or our snacks? Tell us a little more and we’ll help.</p>
    </header>}
    <div className="inquiry-card">
      {bulk ? <div className="inquiry-intro">
        <p className="inquiry-kicker">{bulk ? 'BULK ORDERS & PARTNERSHIPS' : 'CONTACT US'}</p>
        <h1>{bulk ? 'More snacks.' : "Let’s get"}<br/><span>{bulk ? 'Bigger plans.' : 'in touch.'}</span></h1>
        <p>{bulk ? 'Planning a bulk order, stocking SORAA or gifting your team? Tell us what you have in mind.' : 'Have a question about your order or our snacks? Tell us a little more and we’ll help.'}</p>
        <p>Or reach us directly<br/><a href="mailto:we@eatsoraa.com">we@eatsoraa.com</a></p>
        <a href="https://wa.me/919667584803" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        <div className="inquiry-tags"><span>Bulk orders</span><span>Distributors</span><span>Partnerships</span><span>Support</span></div>
      </div> : <div className="inquiry-contact-image">
        <img src="/contact-us-creative.png" alt="Woman holding an orange telephone beside a bowl of nuts and dried fruit" width="1122" height="1402" />
      </div>}
      {bulk ? <BulkForm/> : <ContactForm/>}
    </div>
  </section>;
}


const contactTopics = ['Order Support', 'Shipping & Delivery', 'Returns & Refunds', 'Product Questions', 'Collaboration / Partnership', 'Something Else'];

function ContactForm() {
  return <form method="post" action="https://eatsoraa.com/contact#contact_form" acceptCharset="UTF-8" className="inquiry-form inquiry-contact-form">
    <p className="inquiry-kicker">GET IN TOUCH</p>
    <h2>Let’s talk snacks.</h2>
    <p>Questions, feedback or just want to say hey? Drop us a message. We’re all ears (and snacks).</p>
    <input type="hidden" name="form_type" value="contact"/>
    <input type="hidden" name="utf8" value="✓"/>
    <div className="inquiry-honey" aria-hidden="true"><label>Leave blank<input name="website_check" tabIndex={-1} autoComplete="off"/></label></div>
    <div className="inquiry-fields">
      <label>Your Name<input name="contact[name]" autoComplete="name" required maxLength={120} placeholder="Your name"/></label>
      <label>Email Address<input name="contact[email]" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label>
      <label className="inquiry-wide">What’s this about?<select name="contact[Query type]" required defaultValue=""><option value="" disabled>Select a topic</option>{contactTopics.map(topic=><option key={topic}>{topic}</option>)}</select></label>
      <label className="inquiry-wide">Your Message<textarea name="contact[body]" required maxLength={1000} rows={4} placeholder="Tell us what’s on your mind..."/></label>
    </div>
    <button className="inquiry-submit" type="submit">Send Message →</button>
    <div className="inquiry-contact-bulk">
      <h3>Planning something big?</h3>
      <p>For corporate gifting, events or large snack orders, visit our dedicated Bulk Orders page.</p>
      <Link to="/pages/bulk-order">Explore Bulk Orders →</Link>
    </div>
  </form>;
}


const planOptions = ['Corporate Gifting', 'Bulk Snack Orders', 'Events & Celebrations', 'Custom Hampers'];
const quantityOptions = ['25 – 50', '50 – 100', '100 – 250', '250 – 500', '500 – 1,000', '1,000+'];
const budgetOptions = ['Under ₹500', '₹500 – ₹1,000', '₹1,000 – ₹2,000', '₹2,000 – ₹5,000', '₹5,000+', 'Not sure yet'];
const brandingOptions = ['Yes, logo / branded packaging', 'No, standard SORAA packaging', 'Not sure yet'];

function BulkForm() {
  return <form method="post" action="https://eatsoraa.com/contact#contact_form" acceptCharset="UTF-8" className="inquiry-form inquiry-contact-form inquiry-bulk-form">
    <p className="inquiry-kicker">SORAA FOR TEAMS, EVENTS &amp; CELEBRATIONS</p>
    <h2>Big orders. Bigger snack energy.</h2>
    <p>From office gifting to event snack drops, tell us what you’re planning and we’ll help you find the right fit.</p>
    <input type="hidden" name="form_type" value="contact"/>
    <input type="hidden" name="utf8" value="✓"/>
    <input type="hidden" name="contact[Inquiry]" value="Bulk order"/>
    <div className="inquiry-honey" aria-hidden="true"><label>Leave blank<input name="website_check" tabIndex={-1} autoComplete="off"/></label></div>
    <div className="inquiry-fields">
      <label>Full Name *<input name="contact[name]" autoComplete="name" required maxLength={120} placeholder="Your name"/></label>
      <label>Work Email *<input name="contact[email]" type="email" autoComplete="email" required maxLength={254} placeholder="name@company.com"/></label>
      <label>WhatsApp Number *<input name="contact[phone]" type="tel" autoComplete="tel" required maxLength={25} placeholder="+91"/></label>
      <label>Company Name *<input name="contact[Company]" autoComplete="organization" required maxLength={160} placeholder="Your company"/></label>
      <fieldset className="inquiry-wide inquiry-radios"><legend>What are you planning? *</legend>{planOptions.map((option, index)=><label key={option}><input type="radio" name="contact[Planning]" value={option} required defaultChecked={index === 0}/><span>{option}</span></label>)}</fieldset>
      <label>Estimated Quantity *<select name="contact[Estimated quantity]" required defaultValue=""><option value="" disabled>Select quantity</option>{quantityOptions.map(option=><option key={option}>{option}</option>)}</select></label>
      <label>Budget Per Hamper<select name="contact[Budget per hamper]" defaultValue=""><option value="" disabled>Select budget</option>{budgetOptions.map(option=><option key={option}>{option}</option>)}</select></label>
      <label>Delivery City *<input name="contact[Delivery city]" autoComplete="address-level2" required maxLength={160} placeholder="e.g. Delhi NCR"/></label>
      <label>Expected Delivery Date<input name="contact[Expected delivery date]" type="date"/></label>
      <fieldset className="inquiry-wide inquiry-radios"><legend>Need custom branding?</legend>{brandingOptions.map((option, index)=><label key={option}><input type="radio" name="contact[Custom branding]" value={option} defaultChecked={index === brandingOptions.length - 1}/><span>{option}</span></label>)}</fieldset>
      <label className="inquiry-wide">Anything else we should know?<textarea name="contact[body]" maxLength={1000} rows={4} placeholder="Tell us about your event, gifting needs or special requests..."/></label>
    </div>
    <button className="inquiry-submit" type="submit">Request a Custom Quote →</button>
  </form>;
}
