"use server";

import { apiClient } from "../apiClient";
import { APP_INFO_PATH } from "../constants";

export const getAppInfo = async () => {
  try {
    // const method = appPageForm.Id ? apiClient.put : apiClient.post;
    // const response = await method(APP_INFO_PATH, appPageForm);
    // return response.data;
    // const response = await fetch(`${API_URL}${ADMIN_PAGES_PATH}`, {
    //   method: "POST",
    const response = await apiClient.uGet(APP_INFO_PATH);
    return response.data;
    // );
  } catch (error) {
    throw new Error("Error creating app page: " + error.message);
  }
};
