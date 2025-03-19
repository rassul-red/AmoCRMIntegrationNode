// Import the AmoApiClient from the amotop package
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

// Import configuration (domain, access token, etc.)
const {domain, accessToken, debug} = require('./_config.sample');

// Initialize the AmoApiClient
const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    // Step 1: Create a new lead
    console.log('Creating a new lead...');
    
    const leadData = {
      name: "New Test Lead with Task", 
      price: 5000,
      pipeline_id: 9346766, // Replace with your pipeline ID
      status_id: 74922150,  // Replace with your status ID
    };
    
    console.log('Lead payload:', leadData);
    const leadResponse = await amoApiClient.addLead(leadData);
    console.log('Lead created:', JSON.stringify(leadResponse, null, 2));
    
    // Get the lead ID from the response
    const leadId = leadResponse._embedded?.leads[0]?.id;
    
    if (!leadId) {
      throw new Error('Failed to get lead ID from response');
    }
    
    console.log(`Lead created with ID: ${leadId}`);
    
    // Step 2: Create a task for the lead
    console.log(`Creating a task for lead ID: ${leadId}`);
    
    // Calculate timestamp for 24 hours from now
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    
    const task = [{
      text: "Follow up with client about the proposal",
      complete_till: Math.floor(tomorrow.getTime() / 1000), // Unix timestamp
      entity_id: leadId,
      entity_type: "leads",
      task_type_id: 3789650, // Replace with your task type ID
      responsible_user_id: 12262602 // Replace with your user ID
    }];
    
    console.log('Task payload:', task);
    const taskResponse = await amoApiClient.addTask(task);
    console.log('Task created:', JSON.stringify(taskResponse, null, 2));
    
    // Step 3: Verify the task was created
    console.log('Retrieving tasks to verify...');
    const tasks = await amoApiClient.getTasks({
      filter: {
        entity_id: leadId,
        entity_type: "leads"
      }
    });
    
    console.log('Tasks for lead:', JSON.stringify(tasks, null, 2));
    
    // Fetch users
    const usersResponse = await amoApiClient.getUsers();
    console.log('Users:', JSON.stringify(usersResponse, null, 2));
    
    console.log('Process completed successfully!');
    
  } catch (err) {
    // Handle any errors that occur
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('Error:', errMessage);
  }
};

// Execute the script
(start)(); 