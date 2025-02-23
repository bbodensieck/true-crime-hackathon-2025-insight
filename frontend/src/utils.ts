  export const timeStringToSeconds = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(':').map(parseFloat);
    return minutes * 60 + seconds;
  };