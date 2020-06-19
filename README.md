## Mongoose REST API Autogenerator

Automatically generate a REST API from Mongoose models.

Creates a hot-reloading server that auto-updates whenever models are updated or created.

```
yarn install
yarn start
```

## Adding a model

Simply a new file to `./models`.
The generated URL paths will be:

Create:

- `POST /api/{fileName}`

List all

- `GET /api/{fileName}`

Get one

- `GET /api/{fileName}/:id`

Update one

- `PUT /api/{fileName}/:id`

Delete one

- `DELETE /api/{fileName}/:id`
