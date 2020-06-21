const base = 'http://localhost:5000';
let jwtHeader: string;

import Resource from './apiResources';

// interface Result {
//   error: any;
//   result: any;
// }
// const handle = (promise: Promise<any>): Promise<Result> =>
//   promise
//     .then((result) => ({ error: null, result }))
//     .catch((error) => Promise.resolve({ error, result: null }));

async function proxyFetch(
  method = 'GET',
  url: string,
  data: any,
  authHeader = '',
) {
  const fullURL = `${base}/${url}`;
  console.log(`${method} ${fullURL}`);
  // Default options are marked with *
  const opts: RequestInit = {
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
  };
  if (data) opts.body = JSON.stringify(data);
  let result = await fetch(fullURL, opts)
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return result;
}

const signup = async (username: string, email: string, password: string) => {
  return proxyFetch('POST', 'auth/signup', {
    username,
    email,
    password,
  });
};

const login = async (email: string, password: string) => {
  return proxyFetch('POST', 'auth/login', { email, password }).then((res) => {
    jwtHeader = res.token;
    return jwtHeader;
  });
};

const route = async (
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
  CREATE: (resource: Resource, data: any) => route('POST', resource, '', data),
  LIST: (resource: Resource) => route('GET', resource),
  GET: (resource: Resource, id: string) => route('GET', resource, id),
  UPDATE: (resource: Resource, id: string, data: any) =>
    route('PATCH', resource, id, data),
  REMOVE: (resource: Resource, id: string) => route('DELETE', resource, id),
};

export { api, Resource, signup, login };
