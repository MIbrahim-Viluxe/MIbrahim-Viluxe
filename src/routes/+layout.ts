import settings from "$lib/data/settings.json";
import labels from "$lib/data/labels.json";

// export const prerender = true;
export const trailingSlash = "always";

export const load = async () => {
  const servicesFiles = import.meta.glob("$lib/data/services/*.json", {
    eager: true,
  });
  const packageFiles = import.meta.glob("$lib/data/packages/*.json", {
    eager: true,
  });

  const services = Object.entries(servicesFiles).map(
    ([path, module]: [string, any]) => ({
      ...module.default,
      slug: path.split("/").pop()?.replace(".json", "") || "",
    }),
  );

  const packages = Object.entries(packageFiles).map(
    ([path, module]: [string, any]) => ({
      ...module.default,
      slug: path.split("/").pop()?.replace(".json", "") || "",
    }),
  );

  return {
    settings: {
      ...settings,
      ...labels,
    },
    navData: {
      services,
      packages,
    },
  };
};
