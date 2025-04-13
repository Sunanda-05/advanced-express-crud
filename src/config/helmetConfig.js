import helmet from "helmet";

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],                       // Only allow resources from the same origin
      scriptSrc: ["'self'", "'unsafe-inline'"],     // Allow inline scripts
      objectSrc: ["'none'"],                        // Disallow <object> elements
    },
  },
  xssFilter: true,                                  // Prevent cross-site scripting (XSS) attacks
  noSniff: true,                                    // Prevent browsers from interpreting files as a different MIME type
  frameguard: { action: "deny" },                   // Prevent the site from being embedded in frames
  hidePoweredBy: true,                              // Hide the "X-Powered-By" header
});

export default helmetConfig;
