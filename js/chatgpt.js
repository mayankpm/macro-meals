const fetch = require("node-fetch");
const express = require("express");
const app = express();

const apiKey = "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";
const url = "https://api.openai.com/v1/completions";

app.use(express.json()); // Parse incoming JSON data

// Function to interact with ChatGPT and get the response
async function getChatGptResponse(input) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: input,
                temperature: 0.7, // Adjust the temperature for creativity (0.2 to 1.0)
                max_tokens: 150, // Adjust the max tokens for the response length
            }),
        });
        const data = await response.json();
        const text = data.choices[0].text;

        // Additional information to send to the client
        const responseInfo = {
            text: text,
            prompt: input,
        };

        return { result: responseInfo };
    } catch (error) {
        console.error(error);
        return { error: "Error fetching data from the server." };
    }
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.post("/", async (req, res) => {
    const inputText = req.body.input;
    const output = await getChatGptResponse(inputText);
    res.json(output); // Return the response as JSON
});

// Server setup
app.listen(4000, () => {
    console.log("server running");
});
