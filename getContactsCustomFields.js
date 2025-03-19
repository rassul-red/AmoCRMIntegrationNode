// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    console.log('Retrieving contacts custom fields...');
    
    // Get all contacts custom fields
    const customFields = await amoApiClient.getContactsCustomFields();
    console.log('Custom Fields:', JSON.stringify(customFields, null, 2));
    
    // Find phone field specifically
    const phoneFields = customFields?._embedded?.custom_fields?.filter(field => 
      field.name.toLowerCase().includes('телефон') || 
      field.name.toLowerCase().includes('phone')
    );
    
    if (phoneFields && phoneFields.length > 0) {
      console.log('Phone Fields:', JSON.stringify(phoneFields, null, 2));
    } else {
      console.log('No phone fields found');
    }
    
  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('Error:', errMessage);
  }
};

(start)(); 