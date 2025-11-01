import axios from "axios";

/**
 * Follow or unfollow a user.
 * @param {string} userId - The ID of the user to follow/unfollow.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const followOrUnfollow = async (userId) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/followorunfollow/${userId}`,
      {},
      { withCredentials: true }
    );

    return res.data; // { success: true/false, message: '...' }
  } catch (error) {
    console.error("Follow/Unfollow request failed:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong!",
    };
  }
};
