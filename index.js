const express = require("express");
const app = express();
const fetch = require("node-fetch");

// Define the endpoint to handle the redirect
app.get("/callback", async (req, res) => {
  // Extract the authorization code from the query parameters
  const { code, state } = req.query;
  console.log({ code: code, message: "bryuuu" });

  const clientID = "22337";
  const clientSecret = process.env.client_secret;
  const redirectURI = "https://mia-verify.vercel.app/callback";
  const tokenEndpoint = "https://osu.ppy.sh/oauth/token";

  const requestBody = {
    client_id: clientID,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectURI,
  };

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((res) => res.json());

  const accessToken = response.data.access_token;
  const profileEndpoint = "https://osu.ppy.sh/api/v2/me";

  const profileResponse = await fetch(profileEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());

  const userProfile = profileResponse.data;
  console.log(userProfile);

  // Display the message
  res.send({ message: "You can close this tab now." });

  const link = `https://discord.com/api/webhooks/${process.env.id}/${process.env.token}`;

  fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: `userID=${userProfile.id}\ndiscordID=${state}` }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Message sent successfully!");
      } else {
        console.error("Error sending message:", response.status, response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
});

app.get("/home", async (req, res) => {
  res.send({ test: "working" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
