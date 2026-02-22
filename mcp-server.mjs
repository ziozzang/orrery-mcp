#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod/v4';
import { calculateSaju, createChart, calculateNatal } from './packages/core/dist/index.js';

const inputSchema = {
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59).default(0),
  gender: z.enum(['M', 'F']).default('M'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
};

const server = new McpServer({ name: 'orrery-mcp', version: '0.1.1' });

server.registerTool('calculate_saju', { description: 'Calculate Saju (Four Pillars)', inputSchema }, async (input) => {
  const result = calculateSaju(input);
  return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
});

server.registerTool('calculate_ziwei', { description: 'Calculate Ziwei chart', inputSchema }, async (input) => {
  const result = createChart(input.year, input.month, input.day, input.hour, input.minute ?? 0, input.gender === 'M');
  return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
});

server.registerTool('calculate_natal', { description: 'Calculate Western natal chart', inputSchema }, async (input) => {
  const result = await calculateNatal(input);
  return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
});

async function runSelfTest() {
  const input = { year: 2002, month: 1, day: 1, hour: 12, minute: 30, gender: 'M', latitude: 37.5665, longitude: 126.9780 };
  const saju = calculateSaju(input);
  const ziwei = createChart(input.year, input.month, input.day, input.hour, input.minute, true);
  const natal = await calculateNatal(input);
  console.log(JSON.stringify({
    ok: true,
    sampleInput: input,
    sajuPillars: saju.pillars.map((p) => p.pillar.ganzi),
    ziwei: { year: `${ziwei.yearGan}${ziwei.yearZhi}`, ming: ziwei.mingGongZhi, shen: ziwei.shenGongZhi },
    natal: { asc: natal.angles.asc.sign, sun: natal.planets.find((p) => p.id === 'Sun')?.sign, moon: natal.planets.find((p) => p.id === 'Moon')?.sign },
  }, null, 2));
}

async function main() {
  if (process.argv.includes('--self-test')) {
    await runSelfTest();
    return;
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
