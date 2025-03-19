// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});


const start = async () => {
  try {
    console.log('Creating lead with direct approach...');
    const leadData = {
      name: "vasya", 
      price: 5000,
       
      pipeline_id: 9346766, 
      status_id: 74922150,
      
      // Adding contact information with phone number
      _embedded: {
        contacts: [
          {
            name: "Vasya Contact",
            custom_fields_values: [
              {
                field_id: 3001152, // Correct field ID for phone from the API response
                field_name: "Телефон", // Phone field name
                values: [
                  {
                    value: "+79123456789", // Replace with the actual phone number
                    enum_id: 4678870, // Using the MOB (mobile) enum ID from the API response
                    enum_code: "MOB" // Using the MOB (mobile) enum code from the API response
                  }
                ]
              }
            ]
          }
        ]
      }
    };
    console.log('lead payload', leadData);
    
    const leadResponse3 = await amoApiClient.addLead(leadData);
    console.log('leadResponse', JSON.stringify(leadResponse3, null, 2));

  } catch (err) {
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('err', errMessage);
  }
}   

(start)();


/*

[AmoApiClient][Request] POST https://mobilontestdev.amocrm.ru/api/v4/leads [{"name":"Продать слона","price":1000}]
[AmoApiClient][Response] POST https://mobilontestdev.amocrm.ru/api/v4/leads 200:OK {"_links":{"self":{"href":"https://mobilontestdev.amocrm.ru/api/v4/leads"}},"_embedded":{"leads":[{"id":40885329,"request_id":"0","_links":{"self":{"href":"https://mobilontestdev.amocrm.ru/api/v4/leads/40885329"}}}]}}

*/
