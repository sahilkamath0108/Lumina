import supabase from "../supabase/configure.js"

export function verifySupabaseJWT(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  supabase.auth
    .getUser(token)
    .then(({ data, error }) => {
      if (error || !data?.user) {
        return res.status(401).json({ error: "Invalid or expired token" })
      }

      req.user = { id: data.user.id, email: data.user.email }
      next()
    })
    .catch(() => res.status(401).json({ error: "Invalid or expired token" }))
}
