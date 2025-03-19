const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

const {domain, accessToken, debug} = require('./_config.sample');

const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const users = await amoApiClient.getUsers();
    console.log('users', JSON.stringify(users, null, 2));
  } catch (err) {
    console.log('err', JSON.stringify(err.response.data, null, 2));
  }
}   

(start)();
