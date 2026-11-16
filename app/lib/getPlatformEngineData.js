export function getEngineVariants(platformData) {
  if (!platformData) return [];

  if (platformData.engineVariants?.length) {
    return platformData.engineVariants;
  }

  if (platformData.engine && platformData.versions?.length) {
    return [{ engine: platformData.engine, versions: platformData.versions }];
  }

  return [];
}

export function getEngineVariant(platformData, engine) {
  const variants = getEngineVariants(platformData);
  if (engine && engine !== 'All') {
    return variants.find((variant) => variant.engine === engine) || null;
  }
  return variants[0] || null;
}
