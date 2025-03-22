// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

/**
 * Creates a custom field "Имя от ИИ" if it doesn't exist and adds/updates its value for a contact
 * @param {number} contactId - ID of the contact
 * @param {string} aiName - Name value to set in the custom field
 * @returns {Promise<object>} - Result of the operation
 */
async function addAiNameToContact(contactId, aiName) {
  try {
    // Step 1: Check if the custom field "Имя от ИИ" exists
    const customFields = await amoApiClient.getContactsCustomFields({});
    console.log('Getting custom fields...');
    
    let aiNameFieldId = null;
    
    // Try to find the field in existing custom fields
    if (customFields._embedded && customFields._embedded.custom_fields) {
      const aiNameField = customFields._embedded.custom_fields.find(
        field => field.name === "Имя от ИИ"
      );
      
      if (aiNameField) {
        aiNameFieldId = aiNameField.id;
        console.log(`Custom field "Имя от ИИ" already exists with ID: ${aiNameFieldId}`);
      }
    }
    
    // Step 2: Create the custom field if it doesn't exist
    if (!aiNameFieldId) {
      console.log('Creating custom field "Имя от ИИ"...');
      const newCustomField = [{
        name: "Имя от ИИ",
        type: "text",
        code: "AI_NAME",
        sort: 100
      }];
      
      const result = await amoApiClient.addContactsCustomFields(newCustomField);
      console.log('Custom field created:', JSON.stringify(result, null, 2));
      
      // Get the ID of the newly created field
      if (result._embedded && result._embedded.custom_fields) {
        aiNameFieldId = result._embedded.custom_fields[0].id;
      } else {
        throw new Error('Failed to get ID of the newly created custom field');
      }
    }
    
    // Step 3: Update the contact with the custom field value
    console.log(`Updating contact ${contactId} with AI name: ${aiName}`);
    const updatedContact = {
      custom_fields_values: [
        {
          field_id: aiNameFieldId,
          values: [
            {
              value: aiName
            }
          ]
        }
      ]
    };
    
    const updateResult = await amoApiClient.updateContact(contactId, updatedContact);
    console.log('Contact updated successfully');
    return updateResult;
  } catch (err) {
    console.error('Error:', JSON.stringify(err.response?.data || err, null, 2));
    throw err;
  }
}

// Example usage
const start = async () => {
  try {
    const contactId = 68535686; // Replace with your actual contact ID
    const aiName = "Александр"; // The AI-generated name you want to set
    
    const result = await addAiNameToContact(contactId, aiName);
    console.log('Operation result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Operation failed:', err);
  }
};

// Uncomment the line below to run the example
(start)();

