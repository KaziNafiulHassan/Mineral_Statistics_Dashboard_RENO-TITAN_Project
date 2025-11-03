import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
// FIX: Imported sankeyJustify and sankeyLinkHorizontal from d3-sankey and removed unused SankeyLayout.
import { sankey, sankeyJustify, sankeyLinkHorizontal, SankeyNode as D3SankeyNode, SankeyLink as D3SankeyLink } from 'd3-sankey';
import { SankeyData } from '../../types';

interface SankeyChartProps {
  data: SankeyData;
}

type Node = D3SankeyNode<{name: string}, {}>;
type Link = D3SankeyLink<{name: string}, {}>;

const SankeyChart: React.FC<SankeyChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
        if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current)
        }
    };
  }, []);

  if (!data || !data.nodes || !data.links) {
    return <div className="text-center text-gray-400">Loading data...</div>;
  }
  
  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div ref={containerRef} className="w-full h-full"></div>;
  }
  
  const { width, height } = dimensions;

  // FIX: Removed incorrect type annotation and used generics on sankey() to resolve type error.
  const sankeyLayout = sankey<{name: string}, {}>()
    .nodeWidth(20)
    .nodePadding(25)
    // FIX: Used sankeyJustify directly instead of from d3 namespace.
    .nodeAlign(sankeyJustify)
    .extent([[1, 5], [width - 1, height - 5]]);

  const { nodes, links } = sankeyLayout(data);

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  return (
    <div ref={containerRef} className="w-full h-full">
        <svg width="100%" height="100%">
            <g>
                {links.map((link: Link, i) => (
                <path
                    key={i}
                    // FIX: Used sankeyLinkHorizontal directly instead of from d3 namespace.
                    d={sankeyLinkHorizontal()(link)}
                    stroke="#4A5568"
                    strokeWidth={Math.max(1, link.width!)}
                    strokeOpacity={0.3}
                    fill="none"
                >
                    <title>{`${(link.source as Node).name} → ${(link.target as Node).name}\n${(link.value ?? 0).toLocaleString()} kt`}</title>
                </path>
                ))}
            </g>
            <g>
                {nodes.map((node: Node) => (
                <g key={node.name} transform={`translate(${node.x0},${node.y0})`}>
                    <rect
                    x={0}
                    y={0}
                    width={node.x1! - node.x0!}
                    height={Math.max(1, node.y1! - node.y0!)}
                    fill={color(node.name!)}
                    >
                    <title>{`${node.name}\n${(node.value ?? 0).toLocaleString()} kt`}</title>
                    </rect>
                </g>
                ))}
            </g>
            <g className="text-xs font-sans" fill="#E2E8F0">
                 {nodes.map((node: Node) => (
                    <text
                        key={node.name}
                        x={node.x0! < width / 2 ? node.x1! + 6 : node.x0! - 6}
                        y={(node.y1! + node.y0!) / 2}
                        dy="0.35em"
                        textAnchor={node.x0! < width / 2 ? "start" : "end"}
                        className="pointer-events-none"
                    >
                       {`${node.name}: ${node.value?.toLocaleString()} kt`}
                    </text>
                 ))}
            </g>
        </svg>
    </div>
  );
};

export default SankeyChart;