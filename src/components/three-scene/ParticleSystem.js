import {BufferGeometry, Object3D, MathUtils, Points, Float32BufferAttribute, Color, Vector3} from 'three';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler';
import {ParticleMaterial} from '../materials/ParticleMaterial';
import {PARAMS} from '../materials/ParticleMaterialParams';

export class ParticleSystem extends Object3D {

    constructor(mesh) {
        super();

        this.MAX_PARTICLES = 20000;
        this.objectMesh = mesh;

        this.preload().then(() => {
            this.initMaterial();
            this.initSystem();
        });
    }

    async preload() {
        // Load async stuff
    }

    initMaterial() {
        const {
            progress,
            baseNoiseIteration,
            noiseDiffusion,
            noisePrecision,
            mainColor,
            lightningDiffusion,
            lightningThickness,
            vanishDirection,
            particleDiffusion,
        } = PARAMS

        const geom = this.objectMesh.geometry;
        geom.computeBoundingBox();
        const size = new Vector3();
        geom.boundingBox.getSize(size);

        this.material = new ParticleMaterial({
            progress,
            time: {value: 0},
            baseNoiseIteration,
            noiseDiffusion,
            noisePrecision,
            lightningDiffusion,
            lightningThickness,
            vanishDirection,
            particleDiffusion,
            color: {value: new Color(mainColor)},
            size: {value: size},
            direction: {value: 1},
            prevDirection: {value: 1},
            speed: {value: 0},
        });
    }

    initSystem() {
        const geom = new BufferGeometry();
        const vertices = [];
        const normals = [];
        const sizes = [];
        const colors = [];
        const randoms = [];

        const sampler = new MeshSurfaceSampler(this.objectMesh).setWeightAttribute('uv').build();
        const v3 = new Vector3();
        const n3 = new Vector3();

        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            sampler.sample(v3, n3);

            const scale = MathUtils.randFloat(0.1, 0.25);
            const color = new Color().setHSL(Math.random(), 1, 0.5);

            sizes.push(scale);
            colors.push(color.r, color.g, color.b);
            vertices.push(v3.x, v3.y, v3.z);
            normals.push(n3.x, n3.y, n3.z);
            randoms.push(Math.random());
        }

        geom.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geom.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geom.setAttribute('scale', new Float32BufferAttribute(sizes, 1));
        geom.setAttribute('aColor', new Float32BufferAttribute(colors, 3));
        geom.setAttribute('aRandom', new Float32BufferAttribute(randoms, 1));

        const systemMesh = new Points(geom, this.material);
        systemMesh.frustumCulled = false;

        this.add(systemMesh);
    }
}
