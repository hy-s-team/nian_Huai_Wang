import {Clock, RawShaderMaterial} from "three";
import {ParticleMatShader} from "./ParticleMatShader";

export class ParticleMaterial extends RawShaderMaterial {
    constructor(uniforms = {}) {
        super({
            vertexShader: ParticleMatShader.vertexShader,
            fragmentShader: ParticleMatShader.fragmentShader,
            transparent: true,
            depthWrite: false,
        });
        this.uniforms = uniforms;
        this.clock = new Clock();
    }

    onUpdate() {
        this.uniforms.time.value += this.clock.getDelta();
        this.uniforms.prevDirection.value = this.uniforms.progress.value;
    }
}
