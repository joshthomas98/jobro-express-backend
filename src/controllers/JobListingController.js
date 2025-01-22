const JobListing = require("../models/JobListing");
const User = require("../models/User");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
require("dotenv").config();

// Function to generate PDF from the AI-optimised CV text
async function generateOptimisedCVPdf(text) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // Add the AI-optimised text to the PDF
    doc.fontSize(12).text(text, 100, 100); // Adjust positions as needed

    doc.end();
  });
}

// Fetch all job listings
exports.getJobListings = async (req, res) => {
  try {
    const jobListings = await JobListing.find();
    res.json(jobListings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job listings" });
  }
};

// Fetch a single job listing by ID
exports.getJobListingById = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing)
      return res.status(404).json({ error: "Job listing not found" });
    res.json(jobListing);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job listing" });
  }
};

// Create a new job listing
exports.createJobListing = async (req, res) => {
  try {
    const jobListing = new JobListing(req.body);
    await jobListing.save();
    res.status(201).json(jobListing);
  } catch (error) {
    res.status(400).json({ error: "Error creating job listing" });
  }
};

// Update a job listing by ID
exports.updateJobListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobListing = await JobListing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!jobListing)
      return res.status(404).json({ error: "Job listing not found" });
    res.json(jobListing);
  } catch (error) {
    res.status(400).json({ error: "Error updating job listing" });
  }
};

// Delete a job listing by ID
exports.deleteJobListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobListing = await JobListing.findByIdAndDelete(id);
    if (!jobListing)
      return res.status(404).json({ error: "Job listing not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting job listing" });
  }
};

// Process the job listing text with AI to generate an optimised CV
exports.processTextWithAI = async (combinedText) => {
  const OPENAI_API_URL = process.env.OPENAI_API_URL;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const NEW_PROMPT = process.env.NEW_PROMPT;

  //     const PROMPT = `Act as a professional CV expert specialising in job application optimisation. Given a base CV and a specific job description, your task is to tailor the CV to highlight the most relevant skills, experiences, and achievements that align with the job requirements. Perform the following steps:
  // 1. Reorder, rephrase, or refine existing sections of the CV to better match the language, keywords, and priorities of the job description.
  // 2. Ensure all grammar, spelling, and formatting are error-free, adhering to UK English conventions throughout.
  // 3. Preserve the original content and integrity of the CV without inventing new information, but enhance and emphasise key points where applicable.
  // 4. Ensure the CV passes ATS (Applicant Tracking System) filters by incorporating relevant keywords from the job description naturally.
  // 5. Make the CV concise, impactful, and tailored to stand out to hiring managers.

  // Provide the output as a fully customised and professional CV tailored to the job description. The input will include the users base CV followed by the job description.`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: NEW_PROMPT },
      { role: "user", content: combinedText },
    ],
    temperature: 0.5,
    max_tokens: 1500,
    frequency_penalty: 1,
  };

  try {
    const response = await axios.post(OPENAI_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    // Accessing message.content for gpt-3.5-turbo response structure
    const data = response.data.choices[0].message.content.trim();
    return data;
  } catch (error) {
    // Log the full error for debugging purposes
    console.error("Error in processTextWithAI:", error);

    // Check if the error is from Axios and includes a response
    if (error.response) {
      const { status, statusText, data } = error.response;
      console.error(
        `Axios Error: ${status} ${statusText} - ${
          data?.error?.message || JSON.stringify(data)
        }`
      );
      throw new Error(
        `Failed to process text with AI. Received ${status} ${statusText} from OpenAI API: ${
          data?.error?.message || "No additional details"
        }`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from OpenAI API:", error.request);
      throw new Error(
        "Failed to process text with AI. No response received from OpenAI API. Please check your network connection or the API status."
      );
    } else {
      // Some other kind of error
      console.error("Unexpected error:", error.message);
      throw new Error(
        `Failed to process text with AI. Unexpected error: ${error.message}`
      );
    }
  }
};

// Receive job listing text, combine with user's base CV, and generate PDF with AI-optimised CV
exports.receiveJobListingText = async (req, res) => {
  const { jobListingText } = req.body;
  const { userId } = req.params;

  try {
    // Find the user's data
    console.log("Received userId:", userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Ensure baseCV content exists before processing
    if (!user.baseCV || !user.baseCV.content) {
      return res.status(404).json({ error: "Base CV content not found." });
    }

    // Get base CV text directly from the content field
    const baseCVText = user.baseCV.content;

    // Combine base CV text and job listing text
    const combinedText = `${baseCVText}\n\n${jobListingText}`;

    // Call AI to generate the optimised CV
    const optimisedCv = await exports.processTextWithAI(combinedText);

    if (!optimisedCv) {
      return res
        .status(500)
        .json({ error: "AI failed to generate optimised CV." });
    }

    // Generate a new PDF from the AI-optimised text
    const pdfBuffer = await generateOptimisedCVPdf(optimisedCv);

    // Send the PDF as a downloadable response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=optimised_cv.pdf"
    );
    res.send(pdfBuffer);
    console.log(pdfBuffer);
  } catch (error) {
    console.error("Error in receiveJobListingText:", error);
    res
      .status(500)
      .json({ error: error.message || "Error processing job listing and CV." });
  }
};
