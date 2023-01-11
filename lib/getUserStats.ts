export default async function getUserStats(apiRoute, session) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const allStats = await response.json();
    const myStats = allStats.filter(
      (i: { userEmail: string | null | undefined }) =>
        i.userEmail === session?.email
    );
    return myStats;
  } catch (error) {
    console.log("error: ", error);
  }
}
