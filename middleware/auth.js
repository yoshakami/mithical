export default function (to, from) {
  const cards = localStorage.getItem("cards");
  if (!cards || cards.length == 0) {
    return navigateTo("/cards");
  }
}
