import axios from "axios";

export async function createChannel(
  channelId: string,
  channelName: string,
  channelDescription: string,
  organizerId: string
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/channel/create`,
      {
        channelId,
        channelName,
        channelDescription,
        organizerId,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating channel:", error);
  }
}
