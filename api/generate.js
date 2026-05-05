export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    console.log("API HIT ✅");

    const { prompt } = req.body;
console.log("Prompt:", prompt);

    console.log("API KEY:", process.env.API_KEY ? "FOUND ✅" : "MISSING ❌");
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );
        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data));
        res.status(200).json(data);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: "API request failed" });
    }
}
