const { getNotionData } = require('../models/notionApi');
const Notion = require('../models/notionFAQ'); // For FAQs
const Profiles = require('../models/notionPhotos'); // For Profiles, if using separate collections
const Comments = require('../models/notionComments'); // Our new model for comments

// Function to extract the relevant FAQ data
const extractFAQs = (notionData) => {
  if (!notionData || !notionData.results) return [];

  return notionData.results
    .filter((page) => page.properties?.Status?.status?.name === "Done")
    .map((page) => ({
      Question: page.properties?.Question?.title[0]?.text?.content || "No question available",
      Answer: page.properties?.Answer?.rich_text[0]?.text?.content || "No answer available"
    }));
};

// Controller to get FAQs from Notion and send response
const getFAQs = async (req, res) => {
  try {
    const databaseId = process.env.FAQ_DATABASE_ID;
    const apiToken = process.env.NOTION_API_TOKEN;

    if (!databaseId || !apiToken) {
      return res.status(500).json({ error: "Environment variables not set." });
    }

    const notionData = await getNotionData(databaseId, apiToken);
    const filteredFAQs = extractFAQs(notionData);

    const notionDocument = new Notion({ faqs: filteredFAQs });
    await notionDocument.save();

    res.status(200).json(filteredFAQs);
  } catch (err) {
    console.error('Error in FAQ Controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch and save FAQ data from Notion.' });
  }
};
// Function to extract the relevant profile data
const extractPhotos = (notionData) => {
  if (!notionData || !notionData.results) return [];

  // Log the structure of each page to see what is being returned (optional, for debugging)
  // console.log("Inspecting each page's properties...");
  notionData.results.forEach((page, index) => {
    // console.log(`Page ${index} Properties:`, JSON.stringify(page.properties, null, 2));
  });

  // Filter pages where the status is 'Done' and map them to include the required fields
  const profiles = notionData.results
    .filter((page) => page.properties?.Status?.status?.name === "Done")
    .map((page) => ({
      Name: page.properties?.name?.title?.[0]?.text?.content || "No name available",
      Photo: page.properties?.['Files & media']?.files?.[0]?.file?.url || "No photo available",
      BlockID: page.properties?.BlockID?.rich_text?.[0]?.text?.content || "No block ID available",
      Status: page.properties?.Status?.status?.name || "No status available",
      Order: page.properties?.Order?.number || 0, // Extract the order property
    }));

  // Sort the profiles by Order property in ascending order
  profiles.sort((a, b) => a.Order - b.Order);

  return profiles;
};

// Controller to get Profiles from Notion and send response
const getPhotos = async (req, res) => {
  try {
    const databaseId = process.env.PHOTOS_DATABASE_ID;
    const apiToken = process.env.NOTION_API_TOKEN;

    if (!databaseId || !apiToken) {
      return res.status(500).json({ error: "Environment variables not set." });
    }

    // Fetch data from Notion API
    const notionData = await getNotionData(databaseId, apiToken);

    // Extract and sort profiles
    const filteredProfiles = extractPhotos(notionData);

    // Save the filtered data to MongoDB (optional, if you need to persist it)
    const notionDocument = new Profiles({ profiles: filteredProfiles });
    await notionDocument.save();

    // Send the sorted profiles data back to the client
    res.status(200).json(filteredProfiles);
  } catch (err) {
    console.error('Error in Profiles Controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch and save Profile data from Notion.' });
  }
};

// Function to extract the relevant comment data from the Notion response
const extractComments = (notionData) => {
  if (!notionData || !notionData.results) return [];

  // Map over results after filtering for pages with Status "Done"
  const comments = notionData.results
    .filter((page) => page.properties?.Status?.status?.name === "Done")
    .map((page) => ({
      name: page.properties?.Name?.title?.[0]?.text?.content || "No name available",
      src:
        page.properties?.Photos?.files?.[0]?.file?.url ||
        page.properties?.Photos?.files?.[0]?.external?.url ||
        "No photo available",
      review: page.properties?.Review?.rich_text?.[0]?.text?.content || "No review available",
      order: parseInt(page.properties?.Order?.rich_text?.[0]?.text?.content, 10) || 0,
      stars: parseInt(page.properties?.Stars?.rich_text?.[0]?.text?.content, 10) || 0,
    }));

  // Sort the comments array by the Order property in ascending order
  comments.sort((a, b) => a.order - b.order);

  return comments;
};



// Controller to get Comments data from Notion and save it to MongoDB
const getComments = async (req, res) => {
  try {
    const databaseId = process.env.COMMENTS_DATABASE_ID;
    const apiToken = process.env.NOTION_API_TOKEN;

    if (!databaseId || !apiToken) {
      return res.status(500).json({ error: "Environment variables not set." });
    }

    // Fetch data from Notion
    const notionData = await getNotionData(databaseId, apiToken);
    //console.log("Notion Data:", JSON.stringify(notionData, null, 2)); 
    const filteredComments = extractComments(notionData);
    //console.log("Extracted Comments:", filteredComments);

    // Save the fetched comments to your database
    const notionDocument = new Comments({ comments: filteredComments });
    await notionDocument.save();

    res.status(200).json(filteredComments);
  } catch (err) {
    console.error("Error in Comments Controller:", err.message);
    res.status(500).json({ error: "Failed to fetch and save Comments data from Notion." });
  }
};


module.exports = { getFAQs, getPhotos, getComments };
