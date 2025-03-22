const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    // Get all contacts
    const contacts = await amoApiClient.getContacts();
    console.log('contacts', JSON.stringify(contacts, null, 2));

    // Get contacts by specific IDs
    const contactIds = [68573812]; // Replace with your actual contact IDs
    console.log(`Searching for contacts with specific IDs: ${contactIds.join(', ')}`);
    
    // Method 1: Get all contacts and filter by IDs
    const allContacts = await amoApiClient.getContacts();
    if (allContacts._embedded && allContacts._embedded.contacts) {
      const filteredContacts = allContacts._embedded.contacts.filter(contact => 
        contactIds.includes(contact.id)
      );
      console.log('filteredContacts', JSON.stringify(filteredContacts, null, 2));
    }

    // Method 2: Get contacts individually by ID
    const individualContacts = [];
    for (const contactId of contactIds) {
      try {
        const contact = await amoApiClient.getContact(contactId, {});
        individualContacts.push(contact);
      } catch (error) {
        console.log(`Error retrieving contact with ID ${contactId}:`, error.message);
      }
    }
    console.log('individualContacts', JSON.stringify(individualContacts, null, 2));

    // const contactsWithLeads = await amoApiClient.getContacts({with: 'leads'});
    // console.log('contactsWithLeads', JSON.stringify(contactsWithLeads, null, 2));

    // const contactsWithLeadsAndQuery = await amoApiClient.getContacts({with: 'leads', query: 'test'});
    // console.log('contactsWithLeadsAndQuery', JSON.stringify(contactsWithLeadsAndQuery, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
