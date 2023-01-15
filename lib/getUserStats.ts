export default async function getUserStats(apiRoute, session) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const stats = data.filter(
      (i: { userEmail: string | null | undefined }) =>
        i.userEmail === session?.email
    );
    return stats;
  } catch (error) {
    console.log("error: ", error);
  }
}
