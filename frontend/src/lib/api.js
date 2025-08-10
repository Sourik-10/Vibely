import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (onboardingData) => {
  const response = await axiosInstance.post("/auth/onboarding", onboardingData);
  return response.data;
};

export async function getUserFriends() {
  try {
    console.log("Fetching user friends...");
    const response = await axiosInstance.get("/users/friends");
    console.log("Friends response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user friends:", error);
    throw error;
  }
}

export async function getRecommendedUsers() {
  try {
    console.log("Fetching recommended users...");
    const response = await axiosInstance.get("/users");
    console.log("Recommended users response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    throw error;
  }
}

export async function getOutgoingFriendReqs() {
  try {
    console.log("Fetching outgoing friend requests...");
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    console.log("Outgoing requests response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error);
    throw error;
  }
}

export async function sendFriendRequest(userId) {
  try {
    console.log("Sending friend request to:", userId);
    const response = await axiosInstance.post(
      `/users/friend-request/${userId}`
    );
    console.log("Send request response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
}

export async function getFriendRequests() {
  try {
    console.log("Fetching friend requests...");
    const response = await axiosInstance.get("/users/friend-requests");
    console.log("Friend requests response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
}

export async function acceptFriendRequest(requestId) {
  try {
    console.log("Accepting friend request:", requestId);
    const response = await axiosInstance.put(
      `/users/friend-request/${requestId}/accept`
    );
    console.log("Accept request response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
}

export async function getStreamToken() {
  try {
    console.log("Fetching stream token...");
    const response = await axiosInstance.get("/chat/token");
    console.log("Stream token response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stream token:", error);
    throw error;
  }
}

export async function getChatHistory(roomId) {
  const res = await axiosInstance.get(
    `/chat/history/${encodeURIComponent(roomId)}`
  );
  return res.data;
}

export async function updateProfile(profileData) {
  try {
    console.log("Updating profile with data:", profileData);
    const response = await axiosInstance.put("/profile/update", profileData);
    console.log("Profile update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function getNotificationCount() {
  try {
    console.log("Fetching notification count...");
    const response = await axiosInstance.get("/users/friend-requests");
    const incomingCount = response.data?.incomingReqs?.length || 0;
    return incomingCount;
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return 0;
  }
}
