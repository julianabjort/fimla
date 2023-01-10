export default async function updateData(apiRoute, body) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log("error: ", error);
  }
}
