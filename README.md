# E-commerce Example

Example e-commerce page made with Flexbox and Express.js+ejs.

## Setup
- `npm install`,
- `npm start`.

## Calls

(all calls returns HTML pages)
- **GET** `/`: returns a product list page,
- **GET** `/login`: returns a (non-functional) login page,
- **GET** `/cart`: returns a (non-functional) cart page,
- **GET** `/manager`: returns a product manager page,
- **GET**/**POST** `/manager/:action/:id`: executes a certain action (`update`, `delete`, `create`) on a given product id.