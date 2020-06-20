## Mongoose REST API Autogenerator

Automatically generate a REST API from Mongoose models.

Creates a hot-reloading server that auto-updates whenever models are updated or created.

:warning: This code is not recommended for production use since there is no authentication on any endpoints!

## Dev

Create a `.env` file with

```
MONGODB_URL={url_of_mongo_database}
```

Then:

```
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

## TODOs

1. config to disable some endpoints for a resource
2. config for auth!
   - enable extensibility for login object? (eg. phone num, descript, other meta fields)
3. sanitize all inputs in express middleware...
