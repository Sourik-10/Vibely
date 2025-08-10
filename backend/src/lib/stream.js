import StreamChatPkg from "stream-chat";
const { StreamChat } = StreamChatPkg;
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("stream API key or secret is missing");
}

export const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreameUser = async (userData) => {
  try {
    const response = await streamClient.upsertUsers([userData]);
    console.log("Stream upsert response:", response);
    return userData;
  } catch (error) {
    console.error(
      "Error upserting Stream user:",
      error.response?.data || error.message || error
    );
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
