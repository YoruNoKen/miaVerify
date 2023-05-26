const axios = require("axios");
const express = require("express");
const app = express();
const { WebhookClient, EmbedBuilder } = require("discord.js");
require("dotenv/config");

// Define the endpoint to handle the redirect
app.get("/callback", async (req, res) => {
  // Extract the authorization code from the query parameters
  const { code, state } = req.query;
  console.log({ code: code, message: "bryuuu" });

  const clientID = "22337";
  const clientSecret = process.env.client_secret;
  const redirectURI = "http://localhost:3000/callback";
  const tokenEndpoint = "https://osu.ppy.sh/oauth/token";

  try {
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
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userProfile = profileResponse.data;
    console.log(userProfile);

    // Display the message
    res.send({ message: "You can close this tab now." });

    const client = new WebhookClient({ id: process.env.id, token: process.env.token });
    // const embed = new EmbedBuilder().setTitle("User Profile").setde;
    client.send({
      content: "Someone linked their account!",
      embeds: [new EmbedBuilder().setTitle(`userID=${userProfile.id}`).setDescription(`discordID=${state}`)],
    });
  } catch (e) {
    res.send({ message: "Something went wrong. You might already have your account linked.." });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
