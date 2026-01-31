export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question, studentAnswer, correctAnswer } = req.body;
  const apiKey = process.env.AI_GATEWAY_KEY;

  try {
    const response = await fetch("https://api.ai-gateway.vercel.com/v1/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `The question is: "${question}"
Student's answer: "${studentAnswer}"
Correct answer: "${correctAnswer}"
Explain in 1-2 sentences why the answer is correct or incorrect.`
      })
    });

    const data = await response.json();
    res.status(200).json({ review: data.result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI review failed" });
  }
}
