<!-- PROJECT LOGO
<br />
<div align="center">
  <a href="https://tongue-api.vercel.app/">
    <img src="public/favicon.png" alt="Logo" width="80" height="80">
  </a> -->

<h1">Tongue_API</h3>

  <p>
    RESTful API with full CRUD (Create, Read, Update, Delete) capabilities, developed as part of the "Tongue" Node.js project for <a href="https://www.start2impact.it">start2impact</a>. 
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#api-documentation">API Documentation</a></li>
      </ul></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This RESTful API, developed as part of the "Tongue" Node.js project for start2impact, provides full CRUD (Create, Read, Update, Delete) functionality to support efficient backend operations. Designed for flexibility, it facilitates seamless data management and integration with third-party services.

With a developer-friendly and well-documented interface, this API is an ideal solution for robust and scalable backend systems, streamlining data handling and enhancing development workflows.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- MongoDB Atlas

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node.js version 14 or higher
  ```sh
  node -v
  ```
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Dantalian5/Tongue-API.git
   ```
   and navigate to the project directory
   ```sh
   cd Tongue-API
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file in the root directory of the project to store your environment variables.
   ```sh
   touch .env
   ```
4. Enter your API Key:
   For this project, you need access to the MongoDB NoSQL service to manage the databases. You can use a free MongoDB account, or alternatively, you can utilize the sample server provided with the project for a hassle-free setup.

   ```js
   DATABASE_URL = <Your MongoDB Atlas URL + Api Key>;
   DATABASE_URL_STRING = <Your MongoDB Atlas URL + Api Key>;
   PORT = <Your PORT || 3000>>;
   ```

5. Update the necessary configurations in your config.js or any other configuration files your project might have. If you have database connections or external service configurations, specify them in the .env file.

6. Start the server using nodemon
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Once the server is set up, you will be able to make requests to an API that supports CRUD functionalities using GET, POST, PUT, and DELETE methods. Additionally, you can filter the content to suit your needs.

### API Documentation

The Tongue API provides a robust set of endpoints for managing users, posts, and interactions, offering comprehensive CRUD functionalities. Below is a summary of the primary capabilities of this API:

#### Users

- **Create a New User**
  - Endpoint: api/users/
  - Method: POST
  - Description: Creates a new user in the database.
  - Request Body: Includes nickname, age, and city.
- **Get All Users**
  - Endpoint: api/users/
  - Method: GET
  - Description: Retrieves a list of all registered users.
- **Get User by ID**
  - Endpoint: /users/{id}
  - Method: GET
  - Description: Retrieves user information based on their unique ID.
- **Update User by ID**
  - Endpoint: /users/{id}
  - Method: PATCH
  - Description: Updates user information based on their unique ID.
- **Delete User by ID**
  - Endpoint: /users/{id}
  - Method: DELETE
  - Description: Deletes a user based on their unique ID.

#### Posts

- **Create a New Post**
  - Endpoint: /posts/
  - Method: POST
  - Description: Creates a new post associated with an existing user.
- **Get All Posts**
  - Endpoint: /posts/
  - Method: GET
  - Description: Retrieves a list of all posts, in ordwer of creation date.
- **Search Posts**
  - Endpoint: /posts/bydate/{date}
  - Method: GET
  - Description: Searches for posts based on a specific date.
- **Get Post by ID**
  - Endpoint: /posts/{id}
  - Method: GET
  - Description: Retrieves a single post by its ID, with an option to minify the results.
- **Update Post by ID**
  - Endpoint: /posts/{id}
  - Method: PATCH
  - Description: Updates the details of an existing post, only if you are the owner.
- **Delete Post by ID**
  - Endpoint: /posts/{id}
  - Method: DELETE
  - Description: Deletes a post from the database, only if you are the owner.

#### Interactions

- **Create a New Interaction**
  - Endpoint: /interactions/
  - Method: POST
  - Description: Creates a new interaction related to a user and a post.
- **Get All Interactions**
  - Endpoint: /interactions/
  - Method: GET
  - Description: Retrieves a list of all interactions.
- **Search Interactions**
  - Endpoint: /interactions/search
  - Method: GET
  - Description: Searches for interactions based on various criteria like dates, user ID, user name, and city.
- **Get Interaction by ID**
  - Endpoint: /interactions/{id}
  - Method: GET
  - Description: Retrieves a single interaction by its ID.
- **Update Interaction by ID**
  - Endpoint: /interactions/{id}
  - Method: PUT
  - Description: Updates the details of an existing interaction, Only if you are the owner.
- **Delete Interaction by ID**
  - Endpoint: /interactions/{id}
  - Method: DELETE
  - Description: Deletes an interaction from the database, only if you are the owner of the interaction or the owner of the post.

The API is designed to be intuitive, ensuring ease of use while providing detailed responses and error handling.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

- Website - [SOYA](https://gatteoelmo.github.io/soya/)
- Github - [@gatteoelmo](https://github.com/gatteoelmo)
- Linkedin - [Matteo Gallardo](www.linkedin.com/in/matteo-gallardo-091562285)

Project Link: [https://github.com/gatteoelmo/tongue-RESTApi.git](https://github.com/gatteoelmo/tongue-RESTApi.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
