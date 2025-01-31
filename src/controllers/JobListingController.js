const JobListing = require("../models/JobListing");
const mongoose = require("mongoose");
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
  const formattedPrompt = process.env.NEW_PROMPT.replace(/\\n/g, "\n"); // Convert \n to actual newlines

  console.log("ENV Prompt in Railway:", process.env.NEW_PROMPT);
  console.log("Formatted Prompt (After \\n Replacement):", formattedPrompt);

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: formattedPrompt }, // Use formattedPrompt
      { role: "user", content: combinedText },
    ],
    temperature: 0.5,
    max_tokens: 1500,
    frequency_penalty: 1,
  };

  try {
    const response = await axios.post(process.env.OPENAI_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const data = response.data.choices[0]?.message?.content?.trim();
    if (!data) {
      throw new Error("Empty AI response received.");
    }

    return data;
  } catch (error) {
    console.error("Error in processTextWithAI:", error);

    if (error.response) {
      const { status, statusText, data } = error.response;
      console.error(
        `OpenAI API Error: ${status} ${statusText} - ${JSON.stringify(data)}`
      );
      throw new Error(
        `Failed to process text with AI. OpenAI API responded with ${status} ${statusText}.`
      );
    } else if (error.request) {
      console.error("No response received from OpenAI API:", error.request);
      throw new Error("Failed to process text with AI. No response received.");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(
        `Unexpected error in processTextWithAI: ${error.message}`
      );
    }
  }
};

// Function to generate a PDF from AI-optimised text
async function generateOptimisedCVPdf(text) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log("Generated PDF size:", pdfBuffer.length);
        resolve(pdfBuffer);
      });

      doc.fontSize(12).text(text || "No content available", {
        align: "left",
        width: 500,
      });

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}

// Receive job listing text, combine with user's base CV, and generate a downloadable PDF
exports.receiveJobListingText = async (req, res) => {
  const { jobListingText } = req.body;
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const user = await User.findById(userId);
    if (!user || !user.baseCV || !user.baseCV.content) {
      return res.status(404).json({ error: "User or base CV not found." });
    }

    const combinedText = `${user.baseCV.content}\n\n${jobListingText}`;
    const optimisedCv = await exports.processTextWithAI(combinedText);

    if (!optimisedCv) {
      return res
        .status(500)
        .json({ error: "AI failed to generate an optimised CV." });
    }

    const pdfBuffer = await generateOptimisedCVPdf(optimisedCv);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=optimised_cv.pdf"
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error in receiveJobListingText:", error);
    res.status(500).json({
      error: "Error processing job listing and generating CV.",
      details: error.message,
    });
  }
};
