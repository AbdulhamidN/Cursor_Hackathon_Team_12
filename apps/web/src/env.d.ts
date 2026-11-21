interface ImportMetaEnv {
  /** Origin of the API when it is not served from the same origin as the web app. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
