const https = require('https');

// Function to interact with the Notion API using the built-in `https` module
const getNotionData = (databaseId, apiToken) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({});

    const options = {
      hostname: 'api.notion.com',
      path: `/v1/databases/${databaseId}/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    console.log("Connecting to Notion API...");
    console.log("Request options:", options);

    const req = https.request(options, (res) => {
      let responseBody = '';

      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Response Headers: ${JSON.stringify(res.headers, null, 2)}`);

      // Gather data as it comes in
      res.on('data', (chunk) => {
        console.log("Receiving data chunk...");
        responseBody += chunk;
      });

      // On end, parse the response and resolve the promise
      res.on('end', () => {
        console.log("Full response received.");
        console.log("Raw response body:", responseBody); // Log raw response body to see what was received

        if (res.statusCode === 200) {
          try {
            const responseData = JSON.parse(responseBody);
            console.log("Parsed JSON response:", JSON.stringify(responseData, null, 2));
            resolve(responseData);
          } catch (error) {
            console.error("Failed to parse JSON response:", error.message);
            reject(new Error('Failed to parse response from Notion API'));
          }
        } else {
          console.error(`Error from Notion API: ${res.statusCode} - ${res.statusMessage}`);
          console.error("Response Body:", responseBody); // Log the full response body to see the error details
          reject(new Error(`Failed to fetch data from Notion. Status: ${res.statusCode}, Message: ${res.statusMessage}, Body: ${responseBody}`));
        }
      });
    });

    // Handle request errors
    req.on('error', (error) => {
      console.error("Request error:", error.message);
      reject(error);
    });

    // Write the request body and end the request
    req.write(data);
    req.end();
  });
};

module.exports = { getNotionData };
