export const load = async () => {
  const servicesFiles = import.meta.glob("$lib/data/services/*.json", {
    eager: true,
  });

  const services = Object.entries(servicesFiles).map(
    ([path, module]: [string, any]) => {
      return {
        ...module.default,
        slug: path.split("/").pop()?.replace(".json", "") || "",
      };
    },
  );

  return {
    services,
  };
};
