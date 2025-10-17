/*
 * Custom Modules
 */
import app from "./server";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
  console.log(`
    API Routes Available at:
    - Health Check:        GET http://localhost:${config.port}/api/health
    - Ticket Routes:
        Create Ticket:     POST http://localhost:${config.port}/api/v1/tickets
        Get Tickets:       GET http://localhost:${config.port}/api/v1/tickets
        Get Ticket By ID:  GET http://localhost:${config.port}/api/v1/tickets/:id
        Add Comment:       PUT http://localhost:${config.port}/api/v1/tickets/:id
        Delete Ticket:     DELETE http://localhost:${config.port}/api/v1/tickets/:id
    
    - Authentication:      
        Sign Up:           POST http://localhost:${config.port}/api/v1/auth/sign-up
        Sign In:           POST http://localhost:${config.port}/api/v1/auth/sign-in
        Get Current User:  GET http://localhost:${config.port}/api/v1/auth/me
        Logout:            GET http://localhost:${config.port}/api/v1/auth/logout
        Refresh Token:     GET http://localhost:${config.port}/api/v1/auth/refresh-token
  `);
});
