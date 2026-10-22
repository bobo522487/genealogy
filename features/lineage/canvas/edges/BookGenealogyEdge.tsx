import React from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export const BookGenealogyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  selected,
}) => {
  // Classic orthogonal tree lines as in traditional woodblock / modern printed genealogy books
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0, // Crisp orthogonal corners matching genealogy book printing
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        strokeWidth: selected ? 2.5 : 1.5,
        stroke: selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.5)',
        strokeLinecap: 'square',
        ...style,
      }}
    />
  );
};

