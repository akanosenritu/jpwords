import React　from "react";
import {DummyGeneratorContext} from "../DummyGeneratorContext";
import {shuffle} from "lodash"
import particleProblemsData from "../../data/Grammar/Particles/particleProblems.json"
import {ParticleProblem} from "../../data/Grammar/Particles/ParticleProblem";
import {Typography} from "@material-ui/core";
import {particlesGenerator} from "../../data/Grammar/Particles/Utils";

type ParticlesProps = {

}

export const Particles: React.FC<ParticlesProps> = props => {
  const problems = shuffle(Object.entries(particleProblemsData.particles).map(([k, v]) => {
    return Object.keys(new Array(v).fill(0)).map(index => [k, parseInt(index)+1])
  }).flat())
  return  <div>
    <DummyGeneratorContext.Provider value={particlesGenerator}>
      {problems.map(([p, i], index) => {
        const particle = p as string
        const problemIndex = i as number
        return <div>
          <Typography variant={"h6"}>{index+1}</Typography>
          <ParticleProblem particle={particle} index={problemIndex} />
        </div>
      })}
    </DummyGeneratorContext.Provider>
  </div>
}
