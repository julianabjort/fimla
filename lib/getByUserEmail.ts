export default async function getByUserEmail(apiRoute, session) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const filterByUserEmail = data.filter(
      (i: { userEmail: string | null | undefined }) =>
        i.userEmail === session?.email
    );
    const filterByEmail = data.filter(
      (i: { email: string | null | undefined }) => i.email === session?.email
    );
    if (apiRoute === "user") return filterByEmail;
    else return filterByUserEmail;
  } catch (error) {
    console.log("error: ", error);
  }
}
