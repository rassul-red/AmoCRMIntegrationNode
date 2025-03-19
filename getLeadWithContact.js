// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    // Get the lead ID from the previous script output
    const leadId = 38629140; // Replace with the lead ID from the previous output
    
    console.log(`Retrieving lead ${leadId} with contact information...`);
    
    // Get lead with contacts - fixing the 'with' parameter
    const leadWithContacts = await amoApiClient.getLeadById(leadId, { with: 'contacts' });
    console.log('Lead with contacts:', JSON.stringify(leadWithContacts, null, 2));
    
    // Get the lead links to see associated contacts
    console.log(`Retrieving lead links for lead ${leadId}...`);
    const leadLinks = await amoApiClient.getLeadLinks(leadId);
    console.log('Lead links:', JSON.stringify(leadLinks, null, 2));
    
    // If we have contact links, get the contact details
    const contactLinks = leadLinks?._embedded?.links?.filter(link => link.to_entity_type === 'contacts');
    
    if (contactLinks && contactLinks.length > 0) {
      const contactId = contactLinks[0].to_entity_id;
      console.log(`Retrieving contact ${contactId} details...`);
      
      const contactDetails = await amoApiClient.getContact(contactId, {});
      console.log('Contact details:', JSON.stringify(contactDetails, null, 2));
    } else {
      console.log('No contacts associated with this lead');
    }
    
  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('Error:', errMessage);
  }
};

(start)(); 