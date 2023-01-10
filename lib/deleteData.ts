export default async function deleteData(apiRoute, body) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log("error: ", error);
  }
}
