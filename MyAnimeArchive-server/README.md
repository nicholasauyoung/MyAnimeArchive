
# MyAnimeArchive Server

Dockerized Server for MyAnimeArchive with Flask, Celery, RabbitMQ and MySQL
## Deployment

To deploy this Decoy run

```bash
  docker-compose up --build
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`HOST_NAME`

`SQL_USER`

`SQL_PASSWORD`

`SQL_DATABASE`

`CELERY_USER`

`CELERY_PASSWORD`

## API Reference

#### Login

```http
  POST /login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. MyAnimeArchive Username |
| `password` | `string` | **Required**. MyAnimeArchive Password |

#### Register

```http
  POST /register_user
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `string` | **Required**. MyAnimeArchive Username |
| `password` | `string` | **Required**. MyAnimeArchive Password |
| `confirm_password` | `string` | **Required**. MyAnimeArchive Confirmed Password |

#### Returns User Data  (About me, Recently updated, Favorite anime, Friends list)

```http
  POST /user_data
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `string` | **Required**. MyAnimeArchive Username |


#### Returns User's Anime List

```http
  POST /list
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `string` | **Required**. MyAnimeArchive Username |





