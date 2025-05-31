declare module '*.json' {
  const soundsData: Array<{
    title: string;
    location: string;
    imageName: string;
    audioURL: string;
  }>;
  export default soundsData;
}
