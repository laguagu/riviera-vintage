export function basicAuthMiddleware(req: Request) {
  const basicAuth = req.headers.get("authorization");

  if (!basicAuth) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Access"',
      },
    });
  }

  // Basic auth header on muotoa "Basic base64(username:password)"
  const authValue = basicAuth.split(" ")[1];
  const [username, password] = atob(authValue).split(":");

  // Tarkista tunnukset ympäristömuuttujista
  if (username !== "admin" || password !== "admin") {
    return new Response("Invalid credentials", { status: 401 });
  }

  return null;
}
