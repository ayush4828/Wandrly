# Wanderly - Discover Your Next Adventure ✈️

Wanderly is a full-stack travel listing platform that allows users to discover, create, and review unique travel destinations around the world. Whether you're looking for a cozy cabin or a luxury villas, Wanderly connects you with your next memorable stay.

## 🚀 Features

- **Listing Management**: Full CRUD (Create, Read, Update, Delete) operations for travel listings.
- **Review System**: Users can leave ratings and comments on listings to share their experiences.
- **Dynamic UI**: Responsive design built with EJS and Bootstrap, featuring smooth animations.
- **Error Handling**: Custom error handling and input validation for a robust user experience.
- **Flash Messages**: Interactive feedback for user actions (success/error notifications).

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Templating Engine**: [EJS](https://ejs.co/) (Embedded JavaScript) with [ejs-mate](https://www.npmjs.com/package/ejs-mate)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/), Vanilla CSS
- **Validation**: [Joi](https://joi.dev/) for schema validation

## 📁 Project Structure

```text
├── init/           # Database initialization scripts
├── models/         # Mongoose schemas (Listing, Review)
├── public/         # Static assets (CSS, JS, Images)
├── routes/         # Express routes (Listing, Review)
├── utils/          # Utility functions and custom error classes
├── views/          # EJS templates and layouts
├── app.js          # Entry point of the application
├── schema.js       # Joi validation schemas
└── package.json    # Project dependencies and scripts
```

## ⚙️ Installation & Setup

Follow these steps to get the project running locally:

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally

### 2. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Running the Project

```bash
node app.js
```

The server will start on `http://localhost:8080`.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is licensed under the **ISC License**.

---

_Created with ❤️ by [Ayush Patel](https://github.com/ayush4828)_
