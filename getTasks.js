// Import the AmoApiClient from the amotop package
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

// Import configuration (domain, access token, etc.)
const {domain, accessToken, debug} = require('./_config.sample');

// Initialize the AmoApiClient
const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {    
    const tasks = await amoApiClient.getTasks();
    console.log('tasks', JSON.stringify(tasks, null, 2));

    const task = {
      text: 'test task',
      complete_till: 1721539039, // moment().unix(),  unixtime
      entity_id: 28283519,
      entity_type: 'leads',
    }

    const response = await amoApiClient.addTask([task]);
    console.log('add task response', response);
  } catch (err) {
    console.log('err', err);
  }
}   

(start)();
