export default function (to, from) {
  const cards = localStorage.getItem("cards");
  if (!cards || JSON.parse(cards).length == 0) {
    return navigateTo("/cards");
  }
}
