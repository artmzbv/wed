const { getNotionData } = require('../models/notionApi');
const Notion = require('../models/notion');

const extractFAQs = (notionData) => {
  // Check if the Notion data has results
  if (!notionData || !notionData.results) return [];

  // Filter pages where the status is 'Done' and map them to only include Question and Answer
  const faqs = notionData.results
    .filter((page) => page.properties?.Status?.status?.name === "Done")
    .map((page) => ({
      Question: page.properties?.Question?.title[0]?.text?.content,
      Answer: page.properties?.Answer?.rich_text[0]?.text?.content
    }));

  return faqs;
};


// Controller to get FAQs from Notion and send response
const getFAQs = async (req, res) => {
  try {
    const databaseId = process.env.FAQ_DATABASE_ID;
    const apiToken = process.env.NOTION_API_TOKEN;

    if (!databaseId || !apiToken) {
      return res.status(500).json({ error: "Environment variables not set." });
    }

    // Fetch data from Notion API
    const notionData = await getNotionData(databaseId, apiToken);

    // Extract and filter FAQs
    const filteredFAQs = extractFAQs(notionData);

    // Save the filtered data to MongoDB
    const notionDocument = new Notion({ faqs: filteredFAQs });
    await notionDocument.save();

    // Send the filtered data back to the client
    res.status(200).json(filteredFAQs);
  } catch (err) {
    console.error('Error in FAQ Controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch and save FAQ data from Notion.' });
  }
};


// Function to extract the relevant profile data from Notion response
const extractPhotos = (notionData) => {
  // Check if the Notion data has results
  if (!notionData || !notionData.results) return [];

  // Filter pages where the status is 'Done' and map them to only include the required fields
  const profiles = notionData.results
    .filter((page) => page.properties?.Status?.status?.name === "Done")
    .map((page) => ({
      Name: page.properties?.Name?.title?.[0]?.text?.content || "No name available",
      Photo: page.properties?.Photo?.files?.[0]?.file?.url || "No photo available",
      BlockID: page.properties?.BlockID?.rich_text?.[0]?.text?.content || "No block ID available",
      Status: page.properties?.Status?.status?.name || "No status available",
    }));

  return profiles;
};

// Controller to get Profiles from Notion and send response
const getPhotos = async (req, res) => {
  try {
    const databaseId = process.env.PROFILES_DATABASE_ID; // Use a different environment variable for the Profiles database ID
    const apiToken = process.env.NOTION_API_TOKEN;

    if (!databaseId || !apiToken) {
      return res.status(500).json({ error: "Environment variables not set." });
    }

    // Fetch data from Notion API
    const notionData = await getNotionData(databaseId, apiToken);

    // Extract and filter Profiles
    const filteredProfiles = extractProfiles(notionData);

    // Save the filtered data to MongoDB
    const notionDocument = new Notion({ profiles: filteredProfiles });
    await notionDocument.save();

    // Send the filtered data back to the client
    res.status(200).json(filteredProfiles);
  } catch (err) {
    console.error('Error in Profiles Controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch and save Profile data from Notion.' });
  }
};

module.exports = { getFAQs, getPhotos };

