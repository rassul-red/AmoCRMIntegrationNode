// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

/**
 * Normalizes phone number to standard format (+7XXXXXXXXXX)
 * @param {string} phoneNumber - The phone number to normalize
 * @returns {string} Normalized phone number
 */
function normalizePhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // If number starts with 8, replace with 7
  if (digits.startsWith('8')) {
    return '+7' + digits.slice(1);
  }
  
  // If number doesn't start with +7, add it
  if (!digits.startsWith('7')) {
    return '+7' + digits;
  }
  
  return '+' + digits;
}

/**
 * Gets normalized phone number for search (10 digits only)
 * @param {string} phoneNumber - The phone number to normalize
 * @returns {string} Normalized phone number for search
 */
function normalizePhoneForSearch(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, '');
  return digits.slice(-10); // Get last 10 digits
}

/**
 * Checks if a contact has any active deals
 * @param {number} contactId - The contact ID to check
 * @returns {Promise<Array>} Array of active deals
 */
async function getActiveDealsForContact(contactId) {
  try {
    let allLeads = [];
    let page = 1;
    let hasMore = true;

    // Get all leads with contacts, handling pagination
    while (hasMore) {
      const response = await amoApiClient.getLeads({ 
        with: 'contacts',
        page,
        limit: 250 // Maximum allowed by API
      });

      if (!response._embedded?.leads?.length) {
        hasMore = false;
        break;
      }

      allLeads = allLeads.concat(response._embedded.leads);
      hasMore = response._links?.next !== undefined;
      page++;
    }

    console.log(`Retrieved ${allLeads.length} total leads to check for contact ${contactId}`);

    // Filter leads to only include those that have this specific contact
    const contactLeads = allLeads.filter(lead => 
      lead._embedded?.contacts?.some(contact => contact.id === contactId)
    );

    console.log(`Found ${contactLeads.length} leads associated with contact ${contactId}`);

    // Then filter for active deals (not closed and not in status 142)
    const activeDeals = contactLeads.filter(lead => 
      !lead.closed_at && lead.status_id !== 142
    );

    if (activeDeals.length > 0) {
      console.log(`Found ${activeDeals.length} active deals for contact ${contactId}:`);
      activeDeals.forEach(deal => {
        console.log(`- Deal ID: ${deal.id}`);
        console.log(`  Name: ${deal.name}`);
        console.log(`  Price: ${deal.price}`);
        console.log(`  Status: ${deal.status_id}`);
        console.log(`  Created: ${new Date(deal.created_at * 1000).toLocaleString()}`);
        console.log('---');
      });
    } else {
      console.log(`No active deals found for contact ${contactId}`);
    }

    return activeDeals;
  } catch (err) {
    console.error('Error checking active deals:', err);
    throw err;
  }
}

/**
 * Creates a lead with a phone number, checking for existing contacts first
 * @param {string} phoneNumber - The phone number to use
 * @param {string} contactName - The name to use for the contact if a new one is created
 * @param {string} leadName - The name to use for the lead
 * @param {number} price - The price for the lead
 * @param {number} pipelineId - The pipeline ID
 * @param {number} statusId - The status ID
 * @returns {Promise<{leadId: number, contactId: number, isNewContact: boolean}>}
 */
async function createLeadWithPhone(
  phoneNumber = "+72783002928",
  contactName = "",
  leadName = "",
  // price = 5000,
  pipelineId = 9346766,
  statusId = 74922150
) {
  // Normalize phone number for storage
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  // Get normalized phone for search (10 digits)
  const searchPhone = normalizePhoneForSearch(phoneNumber);
  
  console.log(`Creating a lead with phone number ${normalizedPhone}...`);
  
  // Step 1: Check if a contact with this phone number already exists
  console.log(`Checking if a contact with phone number ${searchPhone} already exists...`);
  
  try {
    // Get all contacts and filter by phone number in custom fields
    const contacts = await amoApiClient.getContacts();
    console.log(`Retrieved ${contacts?._embedded?.contacts?.length || 0} contacts to check`);
    
    // Find contact with exact matching phone number
    let existingContactId = null;
    
    if (contacts?._embedded?.contacts) {
      // Check each contact's custom fields for the phone number
      for (const contact of contacts._embedded.contacts) {
        if (contact.custom_fields_values) {
          const phoneFields = contact.custom_fields_values.filter(
            field => field.field_code === "PHONE"
          );
          
          for (const phoneField of phoneFields) {
            for (const phoneValue of phoneField.values) {
              // Compare normalized phone numbers for search
              if (normalizePhoneForSearch(phoneValue.value) === searchPhone) {
                existingContactId = contact.id;
                console.log(`Found existing contact with ID ${existingContactId} that has the phone number ${phoneValue.value}`);
                break;
              }
            }
            if (existingContactId) break;
          }
        }
        
        if (existingContactId) break;
      }
    }
    
    let contactId;
    let isNewContact = false;
    
    // If no existing contact found, create a new one
    if (!existingContactId) {
      console.log('No existing contact found with this phone number. Creating a new contact...');
      
      const contactData = {
        name: contactName,
        custom_fields_values: [
          {
            field_id: 3001152, // Phone field ID from getContactsCustomFields
            field_name: "Телефон",
            values: [
              {
                value: normalizedPhone, // Use normalized phone with +7
                enum_id: 4678870, // MOB enum ID from getContactsCustomFields
                enum_code: "MOB"
              }
            ]
          }
        ]
      };
      
      const contactResponse = await amoApiClient.addContact(contactData);
      contactId = contactResponse._embedded?.contacts[0]?.id;
      
      if (!contactId) {
        throw new Error('Failed to get contact ID from response');
      }
      
      console.log(`New contact created with ID: ${contactId}`);
      isNewContact = true;
    } else {
      // Use the existing contact
      contactId = existingContactId;
      console.log(`Using existing contact with ID: ${contactId}`);
      
      // Check for active deals with this contact
      console.log('Checking for active deals with this contact...');
      const activeDeals = await getActiveDealsForContact(contactId);
      
      if (activeDeals.length > 0) {
        console.log('Found active deals with this contact, skipping lead creation.');
        return {
          leadId: null,
          contactId,
          isNewContact: false,
          activeDeals
        };
      }
    }
    
    // Step 2: Create a lead linked to the contact (new or existing)
    const leadData = {
      name: leadName, 
      //price: price,
      pipeline_id: pipelineId, 
      status_id: statusId,
      _embedded: {
        contacts: [
          {
            id: contactId
          }
        ]
      }
    };
    
    console.log('Creating lead...');
    const leadResponse = await amoApiClient.addLead(leadData);
    const leadId = leadResponse._embedded?.leads[0]?.id;
    
    if (!leadId) {
      throw new Error('Failed to get lead ID from response');
    }
    
    console.log(`Lead created with ID: ${leadId}`);
    console.log(`Success! Lead created with ${isNewContact ? 'new' : 'existing'} contact that has a phone number.`);
    
    return {
      leadId,
      contactId,
      isNewContact,
      activeDeals: []
    };
  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.error('Error:', errMessage);
    throw err;
  }
}

// Example usage
const start = async () => {
  try {
    // Use the default parameters by not passing any arguments
    await createLeadWithPhone();
    
    // Alternatively, you can explicitly pass the values you want:
    /*
    await createLeadWithPhone(
      "+74223456789",  // Phone number
      "Petrov Contact", // Contact name
      "Lead with phone", // Lead name
      5000, // Price
      9346766, // Pipeline ID
      74922150 // Status ID
    );
    */
  } catch (err) {
    console.error('Failed to create lead:', err);
  }
};

(start)(); 