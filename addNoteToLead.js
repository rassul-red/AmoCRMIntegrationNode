// Import the AmoApiClient from the amotop package
const {AmoApiClient} = require('./node_modules/@mobilon-dev/amotop');

// Import configuration (domain, access token, etc.)
const {domain, accessToken, debug} = require('./_config.sample');

// Initialize the AmoApiClient
const amoApiClient = new AmoApiClient(domain, accessToken, {debug});

const start = async () => {
  try {
    // Define the lead ID to which we want to add a note
    // Replace this with an actual lead ID from your amoCRM account
    const leadId = 44403601;
    
    console.log(`Adding a note to lead ID: ${leadId}`);
    
    // Define the note object
    // The Note interface requires a text property and can have additional properties
    const note = {
      text: "This is a test note added via the amotop API client",
      // You can include additional note parameters as needed:
      // note_type: "common", // Type of note (common is default text note)
      // created_by: 123456, // User ID of the note creator
    };
    
    // Add the note to the lead
    const noteResponse = await amoApiClient.addNoteToLead(leadId, note);
    
    console.log('Note successfully added to the lead!');
    console.log('Note details:', JSON.stringify(noteResponse, null, 2));
    
    // Optionally, you can retrieve the lead's notes to verify the note was added
    console.log('Retrieving lead notes to verify...');
    const leadsNotes = await amoApiClient.getLeadsNotes({filter: {entity_id: leadId}});
    console.log('Lead notes:', JSON.stringify(leadsNotes, null, 2));
    
  } catch (err) {
    // Handle any errors that occur
    const errMessage = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err;
    console.log('Error:', errMessage);
  }
};

// Execute the script
(start)(); 