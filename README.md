## Mongoose REST API Autogenerator

Automatically generate a REST API from Mongoose models.

Creates a hot-reloading server that auto-updates whenever models are updated or created.

:warning: This code is not recommended for production use since there is no authentication on any endpoints!

## Dev

Create a `.env` file with

```bash
MONGODB_URL={url_of_mongo_database}
```

Then:

```bash
yarn install
yarn start
```

## Adding a model

Simply create a new file that exports a mongoose model to `./models`.
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

- need to have an `owner_id: String` field in the Mongoose Schema.
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

## TODOs

1. config to disable some endpoints for a resource
2. config for auth!
   - enable extensibility for login object? (eg. phone num, descript, other meta fields)
3. sanitize all inputs in express middleware...
4. support listing with filtering?
