export const load = async () => {
  const packageFiles = import.meta.glob("$lib/data/packages/*.json", {
    eager: true,
  });

  const items = Object.entries(packageFiles).map(([path, module]) => {
    const item = module as any;
    return {
      ...item.default,
      slug: path.split("/").pop()?.replace(".json", "") || "package",
    };
  });

  return {
    packages: items,
  };
};
