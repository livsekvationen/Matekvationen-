// // functions/openai.js

// Om din Node.js-version inte redan har global fetch, 
// se till att du har installerat och importerat node-fetch.
// För nyare Node.js-versioner är fetch inbyggt, men du kan använda följande rad om nödvändigt:
// const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // Läs in data från POST-requesten
    const { userInput } = JSON.parse(event.body);

    // Hämta API-nyckeln från miljövariabeln med nyckeln "APINYCKEL"
    const apiKey = process.env.APINYCKEL;

    // Gör ett anrop till OpenAI:s API med fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Använd din API-nyckel som miljövariabel
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "Du är en kockassistent som ger familjevänliga recept med näringsfokus och blodsockersmarta tips. Inkludera alltid minst en grönsak i varje recept."
          },
          {
            role: "user",
            content: `Jag har följande ingredienser: ${userInput}. Vad kan jag laga?`
          }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();

    // Returnera svaret från OpenAI till klienten
    return {
      statusCode: 200,
      body: JSON.stringify({ output: data.choices[0].message.content })
    };
  } catch (error) {
    console.error("Error in openai function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel med API-anropet." })
    };
  }
};
