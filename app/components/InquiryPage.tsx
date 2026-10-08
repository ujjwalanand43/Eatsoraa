import {useState} from 'react';
import {Link} from 'react-router';

const topics = ['Bulk Order', 'Distributor Inquiry', 'Retailer / Stockist', 'Wholesale', 'Partnership', 'Corporate Order', 'Creator / Influencer', 'Product Inquiry', 'Order Support', 'Shipping / Delivery', 'Return / Refund', 'Product Feedback', 'Press / Media', 'Careers', 'Other'];

export function InquiryPage({bulk = false}: {bulk?: boolean}) {
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<string[]>(bulk ? ['Bulk Order'] : []);
  return <section className="inquiry-page">
    <div className="inquiry-card">
      <div className="inquiry-intro">
        <p className="inquiry-kicker">{bulk ? 'BULK ORDERS & PARTNERSHIPS' : 'CONTACT US'}</p>
        <h1>{bulk ? 'More snacks.' : "Let’s get"}<br/><span>{bulk ? 'Bigger plans.' : 'in touch.'}</span></h1>
        <p>{bulk ? 'Planning a bulk order, stocking SORAA or gifting your team? Tell us what you have in mind.' : 'Have a question about your order or our snacks? Tell us a little more and we’ll help.'}</p>
        <p>Or reach us directly<br/><a href="mailto:we@eatsoraa.com">we@eatsoraa.com</a></p>
        <a href="https://wa.me/919667761803" target="_blank" rel="noreferrer">Chat on WhatsApp ↗</a>
        <div className="inquiry-tags"><span>Bulk orders</span><span>Distributors</span><span>Partnerships</span><span>Support</span></div>
      </div>
      {bulk ? <div className="inquiry-form inquiry-hosted">
        <h2>Tell us about your requirement</h2>
        <p>Submit your bulk order or partnership enquiry through our Shopify form.</p>
        <div className="inquiry-topic-grid">{topics.map(topic=><span key={topic}>{topic}</span>)}</div>
        <p>The form asks for your name, email, phone, company, query type, order number, city, website and message.</p>
        <a className="inquiry-submit" href="https://eatsoraa.com/pages/send-your-query" target="_blank" rel="noopener noreferrer">Open bulk order form ↗</a>
        <p className="inquiry-policy">Opens our secure Shopify form in a new tab.</p>
      </div> : <form method="post" action="https://eatsoraa.com/contact#contact_form" acceptCharset="UTF-8" className="inquiry-form" onSubmit={event=>{
        const form = event.currentTarget;
        const name = form.elements.namedItem('contact[name]') as HTMLInputElement;
        const fields = new FormData(form);
        name.value = `${fields.get('firstName') || ''} ${fields.get('lastName') || ''}`.trim();
      }}>
        <h2>{bulk ? 'Tell us about your requirement' : 'Tell us more'}</h2>
        <p>Tell us what you need and our team will get back to you.</p>
        <input type="hidden" name="kind" value={bulk ? 'bulk' : 'contact'}/>
        <input type="hidden" name="form_type" value="contact"/>
        <input type="hidden" name="utf8" value="✓"/>
        <input type="hidden" name="contact[name]" value=""/>
        <input type="hidden" name="contact[Query type]" value={selected.join(', ')}/>
        <div className="inquiry-honey" aria-hidden="true"><label>Leave blank<input name="website_check" tabIndex={-1} autoComplete="off"/></label></div>
        <div className="inquiry-fields">
          {bulk ? <label>Full name *<input name="name" autoComplete="name" required maxLength={120} placeholder="Your full name"/></label> : <><label>First name *<input name="firstName" autoComplete="given-name" required maxLength={60} placeholder="First name"/></label><label>Last name<input name="lastName" autoComplete="family-name" maxLength={60} placeholder="Last name"/></label></>}
          <label>Email address *<input name="contact[email]" type="email" autoComplete="email" required maxLength={254} placeholder="Your email address"/></label>
          <label>Phone number<div className="inquiry-phone"><select name="contact[Country code]" aria-label="Country calling code" defaultValue="+91"><option value="+91">IN +91</option><option value="+1">US/CA +1</option><option value="+44">UK +44</option><option value="+971">AE +971</option><option value="+65">SG +65</option><option value="+61">AU +61</option></select><input name="contact[phone]" type="tel" autoComplete="tel-national" maxLength={25} placeholder="Phone number"/></div></label>
          <label>Company / Business<input name="contact[Company]" autoComplete="organization" maxLength={160} placeholder="Company or business name"/></label>
          <fieldset className="inquiry-wide"><legend>What can we help you with? *</legend>{bulk ? <div className="inquiry-topic-grid">{topics.map(topic=><label key={topic}><input type="checkbox" checked={selected.includes(topic)} onChange={e=>setSelected(current=>e.target.checked ? [...current,topic] : current.filter(t=>t!==topic))}/><span>{topic}</span></label>)}</div> : <select required value={selected[0] || ''} onChange={e=>setSelected([e.target.value])} aria-label="How can we help you?"><option value="">Select a topic</option>{topics.map(topic=><option key={topic}>{topic}</option>)}</select>}</fieldset>
          <label>Order number<input name="contact[Order number]" maxLength={80} placeholder="e.g. #SOR12345"/></label>
          <label>City / Location<input name="contact[City]" autoComplete="address-level2" maxLength={160} placeholder="Your city"/></label>
          <label className="inquiry-wide">Website / Instagram<input name="contact[Website or Instagram]" maxLength={250} placeholder="https://... or @username"/></label>
          <label className="inquiry-wide">Message *<textarea name="contact[body]" required maxLength={1000} rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us about your query…"/><small>{message.length}/1000</small></label>
        </div>
        <button className="inquiry-submit" disabled={selected.length === 0} type="submit">Submit query <span aria-hidden="true">↗</span></button>
        <p className="inquiry-policy">View our <Link to="/pages/privacy-policy">privacy policy</Link> and <Link to="/pages/terms-conditions">terms of service</Link>.</p>
      </form>}
    </div>
  </section>;
}
