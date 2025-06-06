import { defineCollection, z } from 'astro:content';
const departmentCollection = defineCollection({
    type: 'content',
    schema: () => z.object({ title: z.string() }),
});
export const collections = { department: departmentCollection };
// export const slugOrder = ['perception', 'state-estimation', 'path-planning', 'control', 'hardware', 'simulation'];
export const slugOrder = [
    "control/control",
    "perception/perception",
    "state-estimation/state-estimation",
    "path-planning/path-planning",
    "hardware/hardware",
    "simulation/simulation"
  ];
  
