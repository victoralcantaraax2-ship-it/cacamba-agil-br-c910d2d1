const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type UtmData = Record<(typeof UTM_PARAMS)[number], string>;

export const captureUtms = (): Partial<UtmData> => {
  const params = new URLSearchParams(window.location.search);
  const utms: Partial<UtmData> = {};
  UTM_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) utms[key] = value;
  });
  return utms;
};
