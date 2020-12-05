import {shuffle} from "lodash"
import particleProblemsData from "./particleProblems.json"

export const particlesGenerator = (count: number, exclude: string[]) => {
  return shuffle(Object.keys(particleProblemsData.particles)).filter(particle => !exclude.includes(particle)).slice(0, count)
}