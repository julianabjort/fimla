export default async function getById(apiRoute, id) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const filterByTournamentId = data.filter((i: any) => i.tournamentId === id);
    const filterById = data.filter((i: any) => i.id === id);

    if (apiRoute === "single-tournament") return filterByTournamentId;
    else return filterById;
  } catch (error) {
    console.log("error: ", error);
  }
}
