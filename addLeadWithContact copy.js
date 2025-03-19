// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    // Step 1: Create a contact with phone number
    console.log('Creating contact with phone number...');
    
    const contactData = {
      name: "Vasya Contact",
      custom_fields_values: [
        {
          field_id: 3001152, // Phone field ID
          field_name: "Телефон",
          values: [
            {
              value: "+79123456789",
              enum_id: 4678870, // MOB enum ID
              enum_code: "MOB"
            }
          ]
        }
      ]
    };
    
    console.log('Contact payload:', contactData);
    const contactResponse = await amoApiClient.addContact(contactData);
    console.log('Contact created:', JSON.stringify(contactResponse, null, 2));
    
    // Get the contact ID from the response
    const contactId = contactResponse._embedded?.contacts[0]?.id;
    
    if (!contactId) {
      throw new Error('Failed to get contact ID from response');
    }
    
    // Step 2: Create a lead linked to the contact
    console.log('Creating lead linked to contact...');
    
    const leadData = {
      name: "vasya", 
      price: 5000,
      pipeline_id: 9346766, 
      status_id: 74922150,
      _embedded: {
        contacts: [
          {
            id: contactId
          }
        ]
      }
    };
    
    console.log('Lead payload:', leadData);
    const leadResponse = await amoApiClient.addLead(leadData);
    console.log('Lead created:', JSON.stringify(leadResponse, null, 2));

  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('Error:', errMessage);
  }
};

(start)(); 