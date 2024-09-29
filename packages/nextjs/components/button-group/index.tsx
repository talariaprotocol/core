import { Button } from "../ui/button";

const ButtonGroup = <T extends string | number>({
  options,
  selected,
  onChange,
  disabled,
}: {
  options: T[];
  selected: T;
  onChange: (option: T) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex gap-2">
      {options.map(option => (
        <Button
          key={option}
          onClick={() => onChange(option)}
          variant={selected === option ? "default" : "outline"}
          disabled={disabled}
          className="flex-1"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export { ButtonGroup };
