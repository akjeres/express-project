# Codebase of ["Express yourself with Node.js" lecture](https://binary-studio-academy.github.io/stage-2/lectures/express-yourself-with-nodejs/)

## How to

#### How to start the code

1. `git clone https://github.com/akjeres/express-project.git`
2. `cd express-project`
3. `npm i`
4. `npm run start`
5. By default server running on [localhost:3000](http://localhost:3000)

#### How to use the aplication

#### 1. By default you can see 'Express' in your browser (from [localhost:3000](http://localhost:3000));
#### 2. Recommendations:
  2.1. For the proper usage of the application it is recommended to receive/send responces/request by 'Postman' or similar software.
  2.2. All the public methods need Authorization Headers i.e. {"Authorization": "admin"} (value might be differrent, but not empty).

#### 3. Public methods:
  3.1. GET: /user - get an array of all users. Response sends from local file '/.files/userlist.json'.
    Request example:
      `GET /user/ HTTP/1.1
      Host: host_url
      Content-Type: application/json
      Authorization: admin
      User-Agent: PostmanRuntime/7.13.0
      Accept: */*
      Cache-Control: no-cache
      Postman-Token: 69f81022-12fb-40db-96f1-a7901c782555,b3855ef2-182a-477b-81e5-545b94582985
      Host: host_url
      accept-encoding: gzip, deflate
      content-length: 33
      Connection: keep-alive
      cache-control: no-cache

      {there_might_be_any_value_or_the_request_might_have_an_empty_body}`
    
    Notes: 
      - The response is regular JSON-file. 
      - The request body does not proceed.

    Response example:
      `[
          {
              "_id": "1",
              "name": "Ryu",
              "health": 45,
              "attack": 4,
              "defense": 3,
              "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/ryu-hdstance.gif"
          },
          {
              "_id": "17",
              "name": "Akuma",
              "health": 70,
              "attack": 5,
              "defense": 5,
              "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/akuma-hdstance.gif"
          }
      ]`

    Errors:
      {
        status: 500,
        message: "User List is invalid
                  <br>Error: ENOENT: no such file or directory, open 'path_to/files/userlist.json'"
      }
  3.2 GET: /user/:id - get one user by ID. Response sends from local file '/.files/userlist.json'.
    Request example:
      `GET /user/5 HTTP/1.1
      Host: host_url
      Content-Type: application/json
      Authorization: admin
      User-Agent: PostmanRuntime/7.13.0
      Accept: */*
      Cache-Control: no-cache
      Postman-Token: 4c135286-8abf-4249-a81a-88c167f09d47,38d8c004-30d7-495e-9a43-4e6caf8ffe41
      Host: host_url
      accept-encoding: gzip, deflate
      content-length: 20
      Connection: keep-alive
      cache-control: no-cache

      {there_might_be_any_value_or_the_request_might_have_an_empty_body}`

    Notes: 
      - The response is regular JSON-file. 
      - The request body does not proceed.
      - The request parameters must be integer

    Response example:
      `{
          "_id": "5",
          "name": "Ken",
          "health": 45,
          "attack": 3,
          "defense": 4,
          "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/ken-hdstance.gif"
      }`

    Errors:
      {
        status: 500,
        message: "User List is invalid"
      },
      {
        stratus: 404,
        message: `User with _id = ${req.params.id} is not defined`
      }
  3.3 POST: /user - create user according to the data from the request body
    Request example:
      `POST /user/ HTTP/1.1
      Host: host_url
      Content-Type: application/json
      Authorization: admin
      User-Agent: PostmanRuntime/7.13.0
      Accept: */*
      Cache-Control: no-cache
      Postman-Token: c100245e-4fad-4b9a-8481-92a0802a4409,b4fbea8f-1403-4dd9-8183-1d6319cd951e
      Host: host_url
      accept-encoding: gzip, deflate
      content-length: 42
      Connection: keep-alive
      cache-control: no-cache

      {
        "name": "value",
        "name-2": "value-2"
      }`
    Notes: 
      - The response is regular JSON-file.
      - The request body should not be empty.
      - If user["_id"] does not provided, it will be incremented from the last Users List item _id.
      - The request body could be provided as array of objects, but in this case all the objects must be valid User Datas with correst _id's or without them at all.
      - The fisrt error in the request body will stop the flow and throw an error.
    Response example:
      `[
        {
            "_id": "1",
            "name": "Ryu",
            "health": 45,
            "attack": 4,
            "defense": 3,
            "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/ryu-hdstance.gif"
        },
        {
            "_id": "17",
            "name": "Akuma",
            "health": 70,
            "attack": 5,
            "defense": 5,
            "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/akuma-hdstance.gif"
        },
        {
            "name": "value",
            "name-2": "value-2",
            "_id": "18"
        }
    ]`
    Errors:
      {
        status: 400,
        message: "Invalid User _id"
      },
      {
        status: 403,
        message: `User with '_id' = ${res.body['_id']} exists. Please change the '_id'`
      },
      {
        status: 500,
        message: "Cannot load Users List"
      }
  3.4. PUT: /user/:id - update user according to the data from the request body
    Request Example:
        `PUT /user/2 HTTP/1.1
        Host: host_url
        Content-Type: application/json
        Authorization: admin
        User-Agent: PostmanRuntime/7.13.0
        Accept: */*
        Cache-Control: no-cache
        Postman-Token: 5d58da34-857d-4174-b4a7-47ab0e16a1d2,b55a51ee-6d56-414b-9797-50c0bfe801de
        Host: host_url
        accept-encoding: gzip, deflate
        content-length: 48
        Connection: keep-alive
        cache-control: no-cache

        {
            "name": "value",
            "name-2": "value-2"
        }`
    Notes: 
      - The response is regular JSON-file.
      - You can not overwrite requested user by empty request body.
      - Request body should not be an Array-like, only object-like JSON.
      - You can not change User ID.
    Response example:
        `[
          {
              "_id": "1",
              "name": "Ryu",
              "health": 45,
              "attack": 4,
              "defense": 3,
              "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/ryu-hdstance.gif"
          },
          {
              "_id": "2",
              "name": "value",
              "health": 60,
              "attack": 3,
              "defense": 1,
              "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/dhalsim-hdstance.gif",
              "name-2": "value-2"
          },
          {
              "_id": "17",
              "name": "Akuma",
              "health": 70,
              "attack": 5,
              "defense": 5,
              "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/akuma-hdstance.gif"
          }
      ]`
    
    Errors:
      {
        status: 400,
        message: 'Invalid data provided'
      },
      {
        status: 403,
        message: `You can not change User ID`
      },
      {
        status: 403,
        message: `User with '_id' = ${req.params.id} does not exist. Please change the '_id'`;
      }
      {
        status: 403,
        message: 'Invalid ID'
      },
      {
        status: 500,
        message: 'Cannot load Users List'
      }
  3.5. DELETE: /user/:id - delete one user by ID.
    Request example:
        `DELETE /user/2 HTTP/1.1
        Host: host_url
        Content-Type: application/json
        Authorization: admin
        User-Agent: PostmanRuntime/7.13.0
        Accept: */*
        Cache-Control: no-cache
        Postman-Token: d9cde373-e633-45fe-842c-a1fd31d21318,d1417357-4417-45f3-b49b-8b6901277a20
        Host: host_url
        accept-encoding: gzip, deflate
        content-length: 61
        Connection: keep-alive
        cache-control: no-cache

        {there_might_be_any_value_or_the_request_might_have_an_empty_body}`
    Notes: 
      - The response is regular JSON-file. 
      - The request body does not proceed.
      - The request parameters must be integer
    Response example:
      `[
        {
            "_id": "1",
            "name": "Ryu",
            "health": 45,
            "attack": 4,
            "defense": 3,
            "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/ryu-hdstance.gif"
        },
        {
            "_id": "3",
            "name": "Guile",
            "health": 45,
            "attack": 4,
            "defense": 3,
            "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/guile-hdstance.gif"
        },
        {
            "_id": "17",
            "name": "Akuma",
            "health": 70,
            "attack": 5,
            "defense": 5,
            "source": "http://www.fightersgeneration.com/np5/char/ssf2hd/akuma-hdstance.gif"
        }
      ]`
    Errors:
      {
        status: 403,
        message: "User with '_id' = ${req.params._id} does not exist. Please change the '_id'"
      },
      {
        status: 403,
        message: `Invalid ID`
      },
      {
        status: 500,
        message: "Cannot load Users List"
      }