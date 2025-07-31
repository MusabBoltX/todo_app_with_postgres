# Node.js/Express Todo App with PostgreSQL

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```env
   PGHOST=localhost
   PGUSER=your_db_user
   PGPASSWORD=your_db_password
   PGDATABASE=your_db_name
   PGPORT=5432
   PORT=3000
   ```

3. **Initialize the database:**
   - Create your PostgreSQL database if it doesn't exist.
   - Run the SQL in `db/init.sql` to create the `todos` table:
     ```bash
     psql -U your_db_user -d your_db_name -f db/init.sql
     ```

4. **Start the server:**
   ```bash
   node index.js
   ```

## API Endpoints

- `GET /todos` - List all todos
- `POST /todos` - Add a new todo (`{ "title": "..." }`)
- `PUT /todos/:id` - Update a todo (`{ "title": "...", "completed": true/false }`)
- `DELETE /todos/:id` - Delete a todo 