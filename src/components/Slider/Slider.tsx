interface SliderProps {
  setSliderValue: (value: number) => void;
  sliderValue?: number;
}

export const Slider = ({ setSliderValue, sliderValue = 100 }: SliderProps) => {
  return (
    <input
      type="range"
      onChange={(event) => setSliderValue(event.currentTarget.valueAsNumber)}
      min="0"
      max="1"
      step="0.05"
      value={sliderValue}
    />
  );
};
