## Mongoose REST API Autogenerator

Automatically generate a REST API from Mongoose models.

Creates a hot-reloading server that auto-updates whenever models are updated or created.

:warning: This project is still in an early stage and may undergo breaking changes.

## Dev

Create a `.env` file with

```bash
MONGODB_URL={url_of_mongo_database}
JWT_SECRET = '<signing_secret>'
```

Then:

```bash
yarn install
yarn start
```

## Authentication

- Sign up:
  - `POST /auth/signup`
  - Sample request body:
    ```
    {"username": "bob", "email": "bob@gmail.com", "password": "badpw"}
    ```
- Login:

  - `POST /auth/login`
  - Sample request body:
    ```
    {"email": "bob@gmail.com", "password": "badpw"}
    ```
    - returns a JWT token, eg. `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZWQ3OWM1N2MxZmEzNzExODZlZjljOSIsInVzZXJuYW1lIjoiYWIiLCJpYXQiOjE1OTI2MjI1MDAsImV4cCI6MTU5MjY1ODUwMH0.-eFJ1FcotHsjtmgUaE3f-6fFz_7y8c2dCNqhH8E5S6A`
  - Pass the token in the `Authorization` HTTP header for each subsequent API request.

- View user profile via `GET /auth/profile`

## Adding a model

Simply create a new file that exports a mongoose model to `./models`.

**NOTE: these endpoints cannot be accessed unless you are signed in.**
The generated URL endpoints will be:

Create:

- `POST /api/{fileName}`
  - Inputs are automatically validated using the Mongoose Schema. Errors are returned to the client with a `400` HTTP Error code.

List all

- `GET /api/{fileName}`

Get one

- `GET /api/{fileName}/:id`

Update one

- `PUT /api/{fileName}/:id`

Delete one

- `DELETE /api/{fileName}/:id`

## Implementing permissions

- need to have an `owner_id: String` field in the Mongoose Schema. This field is automatically populated whenever a new object is created via the API endpoint.
- Export a `permissions` object that may override `list/get/update/remove` fields (by default all of these are set to `PUBLIC`)

- Example:

```js
const { Schema } = require("mongoose");
const { PUBLIC, OWNER, NONE } = require("../system/auth/permissions");
const schema = new Schema(
  {
    width: Number,
    height: Number,
    created: { type: Date, default: Date.now },
    name: String,
    owner_id: String,
  },
  { strict: "throw" }
);

const permissions = {
  list: PUBLIC,
  get: PUBLIC,
  update: OWNER,
  remove: NONE,
};

module.exports = { schema, permissions };
```

## Tech used

- Mongoose, Express, Passport

## TODOs

1. config to disable some endpoints for a resource
2. config for auth!
   - enable extensibility for login object? (eg. phone num, descript, other meta fields)
3. sanitize all inputs in express middleware...
4. support listing with filtering?
5. auto-add `owner_id: String` and `{ strict: "throw" }` using Mongoose discriminators for schema inheritance?
