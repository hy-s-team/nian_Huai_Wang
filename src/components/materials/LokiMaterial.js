import {Clock, DoubleSide, RawShaderMaterial} from 'three';
import {LokiMatShader} from './LokiMatShader';

export class LokiMaterial extends RawShaderMaterial {
    constructor(uniforms = {}) {
        super({
            vertexShader: LokiMatShader.vertexShader,
            fragmentShader: LokiMatShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: DoubleSide,
        });

        this.uniforms = uniforms;
        this.clock = new Clock();
    }

    onUpdate() {
        this.uniforms.time.value += this.clock.getDelta();
    }

}
