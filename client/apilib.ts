const base = "localhost:5000";
let jwtHeader: string;

async function proxyFetch(
  url = "",
  data = {},
  method = "GET",
  authHeader = ""
) {
  // Default options are marked with *
  const response = await fetch(`${base}/${url}`, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const postData = async (url = "", data = {}) =>
  await proxyFetch(url, data, "POST");

const signup = async (username: string, email: string, password: string) => {
  return await postData("/auth/signup", { username, email, password });
};

const login = async (email: string, password: string) => {
  let res = await postData("/auth/login", { email, password });
  jwtHeader = res.token;
  return jwtHeader;
};

enum APIAction {
  CREATE = "POST",
  LIST = "GET",
  GET = "GET",
  UPDATE = "PATCH",
  REMOVE = "DELETE",
}

enum Resource {
  box = "box",
  joke = "joke",
  user = "user",
}

const api = async (action: APIAction, resource: Resource, id: string, data) => {
  let url = `api/${resource}`;
  if (id) {
    url += `/${id}`;
  }
  return await proxyFetch(APIAction[action], url, data, jwtHeader);
};

export default {
  api,
  Resource,
  APIAction,
  signup,
  login,
};
