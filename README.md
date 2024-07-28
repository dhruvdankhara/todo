# TODO

This is a project for managing and organizing your daily tasks and to-do lists. It is built using the MERN stack, which includes MongoDB, Express.js, React.js, and Node.js. With this stack, you can create, edit, and delete tasks, mark tasks as completed, filter tasks based on their status and enjoy a responsive design for both mobile and desktop devices.

## Features

- Create, edit, and delete tasks
- Mark tasks as completed
- Filter tasks based on their status (completed, active)
- Responsive design for mobile and desktop devices

## Tech Stack

Here are the languages, tools, and libraries used in this project:

**Client:**

<div>
<img src="https://skillicons.dev/icons?i=react" height="40" alt="react logo"  />
<img width="7">
<img src="https://skillicons.dev/icons?i=tailwind" height="40" alt="tailwindcss logo"  />
<img width="7">
<img src="https://skillicons.dev/icons?i=redux" height="40" alt="redux logo"  />
<img width="7">
<img src="https://skillicons.dev/icons?i=vite" height="40" alt="vite logo"  />
</div>

React Router, Axios, etc.

<br>

**Server:**

<div>
<img src="https://skillicons.dev/icons?i=mongodb" height="40" alt="mongodb logo"  />
<img width="7">
<img src="https://skillicons.dev/icons?i=express" height="40" alt="express logo"  />
<img src="https://skillicons.dev/icons?i=nodejs" height="40" alt="nodejs logo"  />
<img width="7">
</div>

JSON Web Token (JWT), Mongoose, Bcrypt, etc.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

```
git clone https://github.com/dhruvdankhara/todo.git
```

2. Navigate to the project directory:

```
cd todo
```

3. Install dependencies:

```
npm install
```

4. Start the development server:

```
npm start
```

Make sure you have [Node.js](https://nodejs.org) installed on your machine before proceeding with the installation.

## API Reference

#### Auth endpoint

```http
  POST /api/v1/user
```

| Parameter   | Type     | Description   |
| :---------- | :------- | :------------ |
| `/register` | `string` | Register user |
| `/login`    | `string` | Login user    |
| `/logout`   | `string` | Logout user   |

#### Todo endpoints

```http
  GET /api/v1/todos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/`       | `string` | Fetch All user todo               |
| `/{id}`   | `string` | **Required**. Id of todo to fetch |

```http
  POST /api/v1/todos
```

| Parameter      | Type     | Description                               |
| :------------- | :------- | :---------------------------------------- |
| `/`            | `string` | Create todo                               |
| `/{id}`        | `string` | **Required**. Id of todo to edit          |
| `/status/{id}` | `string` | **Required**. Id of todo to toggle status |

```http
  DELETE /api/v1/todos
```

| Parameter | Type     | Description                     |
| :-------- | :------- | :------------------------------ |
| `/{id}`   | `string` | **Required**. Delete todo by id |

## Usage

To use this application, follow these steps:

1. Open your web browser and navigate to `http://localhost:5173`.

2. If you don't have an account, click on the "Register" button and fill in the required information. If you already have an account, click on the "Log In" button and enter your credentials.

3. Once logged in, you can start adding tasks to your to-do list by clicking on the "Add Task" button.

4. To manage your tasks effectively, use the provided filters and sorting options. You can filter tasks based on their status (completed or active).

Feel free to explore the application and make the most out of its features!

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please feel free to create a pull request. We appreciate your contributions and value your input in making this project better.

To contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.

Please ensure that your contributions align with our project's guidelines and coding standards. We will review your pull request and provide feedback as needed.

Thank you for your interest in contributing to our project!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
