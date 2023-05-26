const express = require("express");
const app = express();
const axios = require("axios");

// Define the endpoint to handle the redirect
app.get("/callback", async (req, res) => {
  // Extract the authorization code from the query parameters
  const { code, state } = req.query;
  console.log({ code: code, message: "bryuuu" });

  const clientID = "22337";
  const clientSecret = process.env.client_secret;
  const redirectURI = "https://mia-verify.vercel.app/callback";
  const tokenEndpoint = "https://osu.ppy.sh/oauth/token";

  const response = await axios.post(tokenEndpoint, {
    client_id: clientID,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectURI,
  });

  const accessToken = response.data.access_token;
  const profileEndpoint = "https://osu.ppy.sh/api/v2/me";

  const profileResponse = await axios.get(profileEndpoint, {
    Authorization: `Bearer ${accessToken}`,
  });

  const userProfile = profileResponse.data;
  console.log(userProfile);

  // Display the message
  res.send({ message: "You can close this tab now." });

  const link = `https://discord.com/api/webhooks/${process.env.id}/${process.env.token}`;

  axios
    .post(
      link,
      {
        content: `userID=${userProfile.id}\ndiscordID=${state}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
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
