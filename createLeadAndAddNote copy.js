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
      name: "New Test Lead", 
      price: 5000,
      pipeline_id: 9615982, // Replace with your pipeline ID
      status_id: 76755566,  // Replace with your status ID
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
    
    // Step 2: Add a note to the newly created lead
    console.log(`Adding a note to lead ID: ${leadId}`);
    
    const note = {
      text: "This lead was created automatically. Follow up with client within 24 hours.",
      note_type: "common" // Type of note (common is default text note)
    };
    
    // Add the note to the lead
    const noteResponse = await amoApiClient.addNoteToLead(leadId, note);
    
    console.log('Note successfully added to the lead!');
    console.log('Note details:', JSON.stringify(noteResponse, null, 2));
    
    // Step 3: Retrieve the lead with notes to verify
    console.log('Retrieving lead notes to verify...');
    const leadsNotes = await amoApiClient.getLeadsNotes({filter: {entity_id: leadId}});
    console.log('Lead notes:', JSON.stringify(leadsNotes, null, 2));
    
    // Step 4: Optional - add a second note with different content
    console.log('Adding a second note with additional information...');
    
    const secondNote = {
      text: "Client showed interest in Premium package. Quoted $5000 for annual subscription.",
      note_type: "common"
    };
    
    const secondNoteResponse = await amoApiClient.addNoteToLead(leadId, secondNote);
    console.log('Second note added:', JSON.stringify(secondNoteResponse, null, 2));
    
    console.log('Process completed successfully!');
    
  } catch (err) {
    // Handle any errors that occur
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('Error:', errMessage);
  }
};

// Execute the script
(start)(); 