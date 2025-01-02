# The Reader's Diary

Semester project for Cloud Application Architecture course.

## Author

Ondřej Šabrňák

## Project Description

The application serves as an electronic reader's diary. Users can:

- Manage their book list
- Track reading progress
- Add notes to individual reading records

## Technologies

### Backend

- Node.js, Express.js
- Data storage: JSON files
- Validation: AJV

### Frontend

- React.js
- React Bootstrap for UI components
- React Router for routing management
- React i18next for internationalization
- Context API for state management
- Custom React Hooks for reusable logic

## Project Structure

```
├── server/             # Backend application
│   ├── abl/            # Application Business Logic
│   ├── controllers/    # Express controllers
│   ├── dao/            # Data Access Objects
│   ├── services/       # Shared services
│   ├── constants/      # Constants and configuration
│   └── app.js          # Main application file
├── client/             # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── config/      # Application configuration
│   │   ├── helpers/     # Helper functions
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layout/      # Layout components
│   │   ├── locales/     # Translation files
│   │   ├── pages/       # Application pages
│   │   ├── providers/   # Context providers
│   │   ├── styles/      # CSS styles
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main App component
│   │   ├── Router.js    # Application routing
│   │   ├── i18n.js      # Internationalization setup
│   │   └── index.js     # Application entry point
│   └── public/          # Static files
└── README.md            # Project documentation
```

## Installation and Running

### Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run server in production mode
npm start

# Run server in development mode (auto-restart on changes)
npm run dev
```

### Frontend

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run development server
npm start

# Create production build
npm run build
```

## API Documentation

### Books

- `POST /book/list` - List all books
- `POST /book/get` - Book detail (body: `{ "id": "..." }`)
- `POST /book/create` - Create new book (body: book data)
- `POST /book/update` - Update book (body: book data including ID)
- `POST /book/delete` - Delete book (body: `{ "id": "..." }`)

### Reading Records

- `POST /readingRecord/list` - List records
- `POST /readingRecord/get` - Record detail (body: `{ "id": "..." }`)
- `POST /readingRecord/create` - Create record (body: record data)
- `POST /readingRecord/update` - Update record (body: record data including ID)
- `POST /readingRecord/delete` - Delete record (body: `{ "id": "..." }`)
- `POST /readingRecord/listByBookId` - List records for specific book (body: `{ "bookId": "..." }`)

### Request Examples

#### Get Book Detail

```json
POST /book/get
{
    "id": "78ca114886e227dd06cf4f6838d2a5e4"
}
```

#### Create New Book

```json
POST /book/create
{
    "title": "1984",
    "author": "George Orwell",
    "numberOfPages": 328,
    "isbn": "978-0451524935"
}
```

#### Create Reading Record

```json
POST /readingRecord/create
{
    "bookId": "78ca114886e227dd06cf4f6838d2a5e4",
    "readPages": 50,
    "readingTime": "01:30",
    "date": "14/01/2024",
    "note": "Interesting first chapter"
}
```

## Features

### Backend

- Book management (CRUD operations)
- Reading progress tracking
- Input data validation
  - ISBN validation (format and checksum for both ISBN-10 and ISBN-13)
  - ISBN uniqueness check across all books
- Atomic operations with rollback support
- Standardized error responses

### Frontend

- Responsive design for mobile and desktop devices
- Clear book list display with search functionality
- Detailed book pages with graphical progress display
- Forms for adding and editing books and reading records
  - Real-time ISBN validation (format, checksum, and uniqueness)
  - Support for both ISBN-10 and ISBN-13 formats
  - Validation feedback in form controls
- Multi-language support (Czech, English)
- Visual indicators for reading status and progress
- Toast notifications for user feedback
