const base = 'localhost:5000';
let jwtHeader: string;

const handle = (promise: Promise<any>) =>
  promise
    .then((data) => ({ error: null, data }))
    .catch((error) => Promise.resolve({ error, data: null }));

async function proxyFetch(
  url = '',
  data = {},
  method = 'GET',
  authHeader = '',
) {
  // Default options are marked with *
  return await handle(
    fetch(`${base}/${url}`, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authHeader,
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    }),
  )
    .then((res) => {
      console.log(`${method} ${url}: ${res}`);
      return res.data.json();
    })
    .catch((error) => {
      console.log(error);
    });
}

const postData = async (url = '', data = {}) => {
  console.log('posting', url, data);
  return await proxyFetch(url, data, 'POST');
};

const signup = async (username: string, email: string, password: string) => {
  return await postData('/auth/signup', { username, email, password });
};

const login = async (email: string, password: string) => {
  return await postData('/auth/login', { email, password }).then((res) => {
    jwtHeader = res.token;
    return jwtHeader;
  });
};

enum Resource {
  box = 'box',
  joke = 'joke',
  user = 'user',
}

const apiHelper = async (
  method: string,
  resource: Resource,
  id?: string,
  data?: any,
) => {
  let url = `api/${resource}`;
  if (id) {
    url += `/${id}`;
  }
  return await proxyFetch(method, url, data, jwtHeader);
};
const api = {
  CREATE: (resource: Resource, data: any) =>
    apiHelper('POST', resource, '', data),
  LIST: (resource: Resource) => apiHelper('GET', resource),
  GET: (resource: Resource, id: string) => apiHelper('GET', resource, id),
  UPDATE: (resource: Resource, id: string, data: any) =>
    apiHelper('PATCH', resource, id, data),
  REMOVE: (resource: Resource, id: string) => apiHelper('DELETE', resource, id),
};

export { api, Resource, signup, login };
