// const {AmoApiClient} = require('@mobilon/amotop');
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const leads = await amoApiClient.getLeads();
    console.log('leads', JSON.stringify(leads, null, 2));

    const leadsWithContacts = await amoApiClient.getLeads({with: 'contacts'});
    console.log('leadsWithContacts', JSON.stringify(leadsWithContacts, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
