# Auth Test
Implementation of authorization OAuth 2.0 using Google.

## Setup database
This project uses Prisma, so you'll run into this error:

``` Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. ```

You have to follow the next step to deploy a MongoDB instance in:

### Local machine

1. Execute the `mongod` and specify the DB_PATH you set for MongoDB. This will open a connection with a replica set name.

    ```
    mongod --port=27017 --dbpath=<DB_PATH> --replSet=rs0
    ```

    **Note:** On Windows this path is usually `C:\data\db`

2. Open another terminal and execute `mongosh`. Make sure you have this command before.

3. Finally execute this command:

    ```
    rs.initiate( { _id : "rs0", members: [ { _id: 0, host: "127.0.0.1:27017" } ] })
    ```

Everytime you need to open a connection you must use the command in the first step.

### Docker
In this [link](https://github.com/prisma/prisma/discussions/18958#discussioncomment-7269305) you will find a detailed info of how to set a replica using Docker.