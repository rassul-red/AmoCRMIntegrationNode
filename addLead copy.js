// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});


const start = async () => {
  try {
    const lead3 = {
      ...amoApiClient.addLead({name: "vasya",price: 5000, pipeline_id: 9346766, status_id: 74922150}),
    };
    console.log('lead payload', lead3);

    const leadResponse3 = await amoApiClient.addLead(lead3);
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
