export default async function createData(apiRoute, body) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log("error: ", error);
  }
}
