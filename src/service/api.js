import { BASE_URl } from "./constant/api-constant";

export async function get(endpoint, token = localStorage.getItem("t")) {
  try {
    const header = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(
      `${BASE_URl}${endpoint}?_=${new Date().getTime()}`,
      {
        headers: header,
        cache: "no-store",
      }
    );

    const mainData = await response.json();
    return mainData;
  } catch (error) {
    return { noData: true, data: [] };
  }
}

export async function post(endpoint, body, formdata = false, token = localStorage.getItem("t")) {
  const url = `${BASE_URl}${endpoint}`;

  const options = {
    method: "POST",
    headers: {
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formdata ? body : JSON.stringify(body),
  };

  if (!formdata) {
    options.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log("Error in POST request:", error);
    throw error; 
  }
}

export async function del(endpoint, token = localStorage.getItem("t")) {
  try {
    const header = {
      "Content-Type": "application/json",
      cache: "no-store",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    const response = await fetch(`${BASE_URl}${endpoint}`, {
      method: "DELETE",
      headers: header,
    });
    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
