interface Range {
    id?: number;
    start: number;
    end: number;
    duration: number;
    max_amplitude: number;
    event_type: string;
    videoClipId: number;
}

export default Range;