import waccaSongsData from "~/assets/wacca/waccaSongs.js";

export default defineNuxtPlugin(() => {
  const waccaSongs = useState("waccaSongs", () => waccaSongsData);

  if (import.meta.hot) {
    import.meta.hot.accept("~/assets/wacca/waccaSongs.js", (newModule) => {
      if (newModule) {
        waccaSongs.value = newModule.default;
      }
    });
  }
});
