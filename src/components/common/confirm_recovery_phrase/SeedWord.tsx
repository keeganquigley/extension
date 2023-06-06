import { useThemeContext } from "@src/providers";
import { FC, memo } from "react";
import { useDrop } from "react-dnd";

interface SeedWordProps {
  onDrop: (seedWord: { word: string; accept: string }) => void;
  word: string;
  accept: string;
  index: number;
}

export const SeedWord: FC<SeedWordProps> = memo(function Dustbin({
  onDrop,
  word,
  accept,
  index,
}: SeedWordProps) {
  const { color } = useThemeContext();

  const [{ isOver, canDrop }, drop] = useDrop({
    drop: onDrop,
    accept,
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = "bg-custom-gray-bg";
  const borderColor =
    accept === "word" ? `border-${color}-primary` : "border-custom-gray-bg";
  if (isActive) {
    backgroundColor = `bg-${color}-primary`;
  }

  return (
    <div
      ref={drop}
      className={`${backgroundColor} w-auto px-3 border ${borderColor} rounded-md py-2 text-center cursor-pointer`}
      data-testid="seedword"
    >
      {word === "" ? <span>&nbsp;</span> : `${index}. ${word}`}
    </div>
  );
});
