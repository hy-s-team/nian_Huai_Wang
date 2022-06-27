import {Vector2} from 'three';

export const PARAMS = {
    test: 1,
    progress: {value: 0.0},
    mainColor: 0xffcf79,
    particleDiffusion: {value: 0.3},
    baseNoiseIteration: {value: 5},
    noiseDiffusion: {value: 0.76},
    noisePrecision: {value: 2.6},

    lightningThickness: {value: 0.79},
    lightningPower: {value: 0.07},
    lightningDiffusion: {value: 0.01},
    vanishDirection: {value: new Vector2(0, 1)},

    useBloom: true,
    bloom: {
        strength: 2,
        radius: 0.16,
        threshold: 0.7,
    },
}
